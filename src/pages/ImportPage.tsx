import Download from "@mui/icons-material/Download";
import FileUpload from "@mui/icons-material/FileUpload";
import PlaylistAddCheck from "@mui/icons-material/PlaylistAddCheck";
import TaskAlt from "@mui/icons-material/TaskAlt";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { buildStudentImportTemplateRows } from "../domain/imports/studentImport.js";
import { apiRequest } from "../lib/api";
import { MaterialShell } from "../material/MaterialShell";

type UploadRow = Record<string, string>;

type ImportField = {
  key: string;
  label: string;
  required?: boolean;
};

type PreviewRow = {
  rowNumber: number;
  isValid: boolean;
  errors: Array<{ fieldName?: string; message: string }>;
  normalized: null | {
    name: string;
    planName: string | null;
    startDate: string;
    operationalStatus: string;
  };
};

type PreviewResponse = {
  fields: ImportField[];
  headers: string[];
  mapping: Record<string, string>;
  errors: Array<{ rowNumber: number; fieldName?: string; message: string }>;
  rows: PreviewRow[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    readyToImport: boolean;
  };
};

type PlanResponse = {
  plans: Array<{
    id: string;
    name: string;
    isActive: boolean;
    periodicity: string;
    amountInCents: number;
  }>;
};

type ImportsResponse = {
  batches: Array<{
    id: string;
    status: string;
    fileName: string;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    createdAt: string;
    completedAt: string | null;
    errors: Array<{
      id: string;
      rowNumber: number;
      fieldName: string | null;
      message: string;
    }>;
  }>;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function formatCurrency(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amountInCents / 100);
}

function rowsFromTemplate() {
  return buildStudentImportTemplateRows();
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

async function parseSpreadsheetFile(file: File): Promise<UploadRow[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array", raw: false });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json<UploadRow>(firstSheet, {
    defval: "",
    raw: false,
  });
}

export function ImportPage() {
  const [plans, setPlans] = useState<PlanResponse["plans"]>([]);
  const [history, setHistory] = useState<ImportsResponse["batches"]>([]);
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [fields, setFields] = useState<ImportField[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadReferenceData() {
    const [plansResponse, importsResponse] = await Promise.all([
      apiRequest<PlanResponse>("/api/plans"),
      apiRequest<ImportsResponse>("/api/imports"),
    ]);

    setPlans(plansResponse.plans);
    setHistory(importsResponse.batches);
  }

  useEffect(() => {
    loadReferenceData().catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao carregar importacoes.");
    });
  }, []);

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);
  const criticalErrors = preview?.errors.filter((error) => error.rowNumber === 1) ?? [];

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setBusy(true);
    setErrorMessage(null);
    setMessage(null);
    setPreview(null);

    try {
      const parsedRows = await parseSpreadsheetFile(selectedFile);
      const nextHeaders = Array.from(new Set(parsedRows.flatMap((row) => Object.keys(row))));
      const previewResponse = await apiRequest<PreviewResponse>("/api/imports/students/preview", {
        method: "POST",
        body: JSON.stringify({ fileName: selectedFile.name, rows: parsedRows }),
      });

      setFileName(selectedFile.name);
      setUploadRows(parsedRows);
      setHeaders(nextHeaders);
      setFields(previewResponse.fields);
      setMapping(previewResponse.mapping);
      setPreview(previewResponse);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao ler arquivo.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function refreshPreview(nextMapping = mapping) {
    if (!uploadRows.length) {
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    try {
      const previewResponse = await apiRequest<PreviewResponse>("/api/imports/students/preview", {
        method: "POST",
        body: JSON.stringify({ fileName, rows: uploadRows, mapping: nextMapping }),
      });

      setFields(previewResponse.fields);
      setMapping(previewResponse.mapping);
      setPreview(previewResponse);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao validar importacao.");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirmImport() {
    setBusy(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const response = await apiRequest<{ batch: { fileName: string }; summary: PreviewResponse["summary"] }>(
        "/api/imports/students/confirm",
        {
          method: "POST",
          body: JSON.stringify({ fileName, rows: uploadRows, mapping }),
        }
      );

      setMessage(
        `Importacao concluida para ${response.batch.fileName}: ${response.summary.validRows} alunos gravados.`
      );
      setUploadRows([]);
      setHeaders([]);
      setFields([]);
      setMapping({});
      setPreview(null);
      setFileName("");
      await loadReferenceData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao confirmar importacao.");
      await loadReferenceData();
    } finally {
      setBusy(false);
    }
  }

  function handleTemplateCsvDownload() {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rowsFromTemplate()));
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "modelo-alunos.csv");
  }

  function handleTemplateXlsxDownload() {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rowsFromTemplate());
    XLSX.utils.book_append_sheet(workbook, sheet, "Alunos");
    const output = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    downloadBlob(
      new Blob([output], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "modelo-alunos.xlsx"
    );
  }

  return (
    <MaterialShell
      eyebrow="Importacoes"
      title="Importe alunos com preview, validacao e confirmacao."
      description="Envie CSV ou XLSX, revise o mapeamento das colunas e confirme apenas quando tudo estiver consistente."
      asideDescription="Importacao acelera onboarding sem perder controle sobre duplicidades, planos e status."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download />} onClick={handleTemplateCsvDownload}>
            Modelo CSV
          </Button>
          <Button variant="outlined" startIcon={<Download />} onClick={handleTemplateXlsxDownload}>
            Modelo XLSX
          </Button>
          <Button variant="contained" component="label" startIcon={<FileUpload />}>
            Enviar arquivo
            <input hidden type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </Button>
        </>
      }
    >
      <Stack spacing={2.5}>
        {message ? <Alert severity="success">{message}</Alert> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="overline" color="text.secondary">
                Modelo e regras
              </Typography>
              <Typography variant="h5">Campos esperados para alunos</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Nome e data de inicio sao obrigatorios. Email ou documento deve existir para evitar duplicidade.
              </Typography>
            </Box>
            <Stack spacing={0.75} sx={{ minWidth: { md: 320 } }}>
              {activePlans.slice(0, 4).map((plan) => (
                <Chip
                  key={plan.id}
                  label={`${plan.name} • ${formatCurrency(plan.amountInCents)}`}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {busy ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography variant="body2">Processando arquivo...</Typography>
          </Stack>
        ) : null}

        {headers.length ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
            <Typography variant="overline" color="text.secondary">
              Mapeamento de colunas
            </Typography>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Ajuste antes do preview final
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {fields.map((field) => (
                <FormControl key={field.key} size="small" fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={mapping[field.key] ?? ""}
                    label={field.label}
                    onChange={(event) => {
                      const nextMapping = { ...mapping, [field.key]: event.target.value };
                      setMapping(nextMapping);
                    }}
                  >
                    <MenuItem value="">Nao mapear</MenuItem>
                    {headers.map((header) => (
                      <MenuItem key={header} value={header}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button variant="outlined" onClick={() => refreshPreview()}>
                Revalidar preview
              </Button>
              <Chip label={fileName || "arquivo"} color="secondary" variant="outlined" />
            </Stack>

            {criticalErrors.length ? (
              <Alert severity="warning" sx={{ mt: 1.5 }}>
                {criticalErrors.map((error) => error.message).join(" ")}
              </Alert>
            ) : null}
          </Paper>
        ) : null}

        {preview ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between">
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Preview da importacao
                </Typography>
                <Typography variant="h5">Linhas validadas antes de gravar</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip icon={<PlaylistAddCheck />} label={`${preview.summary.validRows} validas`} color="success" />
                <Chip icon={<WarningAmber />} label={`${preview.summary.invalidRows} invalidas`} color="warning" />
                <Chip icon={<TaskAlt />} label={`${preview.summary.totalRows} linhas`} variant="outlined" />
              </Stack>
            </Stack>

            <TableContainer sx={{ mt: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Linha</TableCell>
                    <TableCell>Aluno</TableCell>
                    <TableCell>Plano</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.rows.map((row) => (
                    <TableRow key={row.rowNumber}>
                      <TableCell>{row.rowNumber}</TableCell>
                      <TableCell>{row.normalized?.name ?? "-"}</TableCell>
                      <TableCell>{row.normalized?.planName ?? "-"}</TableCell>
                      <TableCell>
                        {row.normalized?.startDate
                          ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                              new Date(row.normalized.startDate)
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {!row.normalized
                          ? "-"
                          : row.normalized.operationalStatus === "INACTIVE"
                            ? "Inativo"
                            : "Ativo"}
                      </TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <Chip size="small" color="success" label="Pronta" />
                        ) : (
                          <Stack spacing={0.5}>
                            {row.errors.map((error) => (
                              <Typography key={`${row.rowNumber}-${error.fieldName}-${error.message}`} variant="caption" color="error">
                                {error.message}
                              </Typography>
                            ))}
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleConfirmImport}
                disabled={!preview.summary.readyToImport || busy}
              >
                Confirmar importacao
              </Button>
              {!preview.summary.readyToImport ? (
                <Alert severity="info" sx={{ flex: 1 }}>
                  Corrija as linhas invalidas antes de gravar no banco.
                </Alert>
              ) : null}
            </Stack>
          </Paper>
        ) : null}

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Typography variant="overline" color="text.secondary">
            Historico
          </Typography>
          <Typography variant="h5" sx={{ mb: 1.5 }}>
            Lotes de importacao de alunos
          </Typography>

          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Arquivo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Linhas</TableCell>
                  <TableCell>Validadas</TableCell>
                  <TableCell>Invalidas</TableCell>
                  <TableCell>Concluida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {batch.fileName}
                      </Typography>
                      {!!batch.errors.length && (
                        <Typography variant="caption" color="text.secondary">
                          {batch.errors[0].message}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={batch.status === "COMPLETED" ? "success" : batch.status === "FAILED" ? "error" : "warning"}
                        label={batch.status}
                      />
                    </TableCell>
                    <TableCell>{batch.totalRows}</TableCell>
                    <TableCell>{batch.validRows}</TableCell>
                    <TableCell>{batch.invalidRows}</TableCell>
                    <TableCell>{formatDate(batch.completedAt ?? batch.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </MaterialShell>
  );
}
