import Add from "@mui/icons-material/Add";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Download from "@mui/icons-material/Download";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import ToggleOff from "@mui/icons-material/ToggleOff";
import ToggleOn from "@mui/icons-material/ToggleOn";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
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
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { buildExerciseImportTemplateRows } from "../domain/imports/exerciseImport.js";
import { apiRequest } from "../lib/api";
import { MaterialShell } from "../material/MaterialShell";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  technicalNotes: string | null;
  isActive: boolean;
  _count: { workoutExercises: number };
};

type ExerciseResponse = {
  exercises: Exercise[];
  filters: {
    muscleGroups: string[];
  };
};

type ImportField = {
  key: string;
  label: string;
  required?: boolean;
};

type PreviewResponse = {
  fields: ImportField[];
  headers: string[];
  mapping: Record<string, string>;
  rows: Array<{
    rowNumber: number;
    isValid: boolean;
    errors: Array<{ fieldName?: string; message: string }>;
    normalized: null | {
      name: string;
      muscleGroup: string;
      isActive: boolean;
    };
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    readyToImport: boolean;
  };
  errors: Array<{ rowNumber: number; fieldName?: string; message: string }>;
};

type ImportHistoryResponse = {
  batches: Array<{
    id: string;
    status: string;
    fileName: string;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    completedAt: string | null;
    createdAt: string;
    errors: Array<{
      id: string;
      rowNumber: number;
      fieldName: string | null;
      message: string;
    }>;
  }>;
};

type ExerciseFormState = {
  name: string;
  muscleGroup: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  technicalNotes: string;
  isActive: boolean;
};

const emptyForm: ExerciseFormState = {
  name: "",
  muscleGroup: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
  technicalNotes: "",
  isActive: true,
};

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

async function parseSpreadsheetFile(file: File): Promise<Record<string, string>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array", raw: false });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { defval: "", raw: false });
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function ExercisePage() {
  const [filters, setFilters] = useState({ search: "", muscleGroup: "", status: "all" });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [history, setHistory] = useState<ImportHistoryResponse["batches"]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [form, setForm] = useState<ExerciseFormState>(emptyForm);
  const [uploadRows, setUploadRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [previewFields, setPreviewFields] = useState<ImportField[]>([]);
  const [uploadFileName, setUploadFileName] = useState("");

  async function loadExercises(nextFilters = filters) {
    const params = new URLSearchParams();
    if (nextFilters.search) params.set("search", nextFilters.search);
    if (nextFilters.muscleGroup) params.set("muscleGroup", nextFilters.muscleGroup);
    if (nextFilters.status) params.set("status", nextFilters.status);
    const result = await apiRequest<ExerciseResponse>(`/api/exercises?${params.toString()}`);
    setExercises(result.exercises);
    setMuscleGroups(result.filters.muscleGroups);
  }

  async function loadImports() {
    const result = await apiRequest<ImportHistoryResponse>("/api/imports?type=EXERCISES");
    setHistory(result.batches);
  }

  async function loadAll(nextFilters = filters) {
    const [_, __] = await Promise.all([loadExercises(nextFilters), loadImports()]);
  }

  useEffect(() => {
    loadAll().catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao carregar exercicios.");
    });
  }, []);

  const activeCount = useMemo(() => exercises.filter((exercise) => exercise.isActive).length, [exercises]);

  function openCreateDialog() {
    setEditingExercise(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(exercise: Exercise) {
    setEditingExercise(exercise);
    setForm({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      description: exercise.description ?? "",
      imageUrl: exercise.imageUrl ?? "",
      videoUrl: exercise.videoUrl ?? "",
      technicalNotes: exercise.technicalNotes ?? "",
      isActive: exercise.isActive,
    });
    setDialogOpen(true);
  }

  async function submitForm() {
    setBusy(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      if (editingExercise) {
        await apiRequest(`/api/exercises/${editingExercise.id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        setMessage(`Exercicio "${form.name}" atualizado.`);
      } else {
        await apiRequest("/api/exercises", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMessage(`Exercicio "${form.name}" criado.`);
      }

      setDialogOpen(false);
      setForm(emptyForm);
      await loadExercises();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao salvar exercicio.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleExercise(exercise: Exercise) {
    setBusy(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      await apiRequest(`/api/exercises/${exercise.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !exercise.isActive }),
      });
      setMessage(
        !exercise.isActive
          ? `Exercicio "${exercise.name}" reativado.`
          : `Exercicio "${exercise.name}" inativado.`
      );
      await loadExercises();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao alterar status.");
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplateCsv() {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(buildExerciseImportTemplateRows()));
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "modelo-exercicios.csv");
  }

  function downloadTemplateXlsx() {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(buildExerciseImportTemplateRows()), "Exercicios");
    const output = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    downloadBlob(
      new Blob([output], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "modelo-exercicios.xlsx"
    );
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setBusy(true);
    setErrorMessage(null);
    setMessage(null);
    setPreview(null);

    try {
      const rows = await parseSpreadsheetFile(selectedFile);
      const nextHeaders = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
      const result = await apiRequest<PreviewResponse>("/api/imports/exercises/preview", {
        method: "POST",
        body: JSON.stringify({ fileName: selectedFile.name, rows }),
      });

      setUploadRows(rows);
      setHeaders(nextHeaders);
      setPreview(result);
      setPreviewFields(result.fields);
      setMapping(result.mapping);
      setUploadFileName(selectedFile.name);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao importar arquivo.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function refreshPreview(nextMapping = mapping) {
    if (!uploadRows.length) return;
    setBusy(true);
    setErrorMessage(null);

    try {
      const result = await apiRequest<PreviewResponse>("/api/imports/exercises/preview", {
        method: "POST",
        body: JSON.stringify({ fileName: uploadFileName, rows: uploadRows, mapping: nextMapping }),
      });
      setPreview(result);
      setPreviewFields(result.fields);
      setMapping(result.mapping);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao revalidar preview.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmImport() {
    setBusy(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const result = await apiRequest<{ batch: { fileName: string }; summary: PreviewResponse["summary"] }>(
        "/api/imports/exercises/confirm",
        {
          method: "POST",
          body: JSON.stringify({ fileName: uploadFileName, rows: uploadRows, mapping }),
        }
      );

      setMessage(`Importacao concluida para ${result.batch.fileName}: ${result.summary.validRows} exercicios gravados.`);
      setUploadRows([]);
      setHeaders([]);
      setPreview(null);
      setPreviewFields([]);
      setMapping({});
      setUploadFileName("");
      await loadAll();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao confirmar importacao.");
      await loadImports();
    } finally {
      setBusy(false);
    }
  }

  return (
    <MaterialShell
      eyebrow="Exercicios"
      title="Biblioteca de exercicios real para abastecer os treinos."
      description="Crie, edite, inative e importe exercicios com nome, grupo muscular, URLs e notas tecnicas."
      asideDescription="Exercicios consistentes destravam montagem, duplicacao e importacao de treinos."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download />} onClick={downloadTemplateCsv}>
            Modelo CSV
          </Button>
          <Button variant="outlined" startIcon={<Download />} onClick={downloadTemplateXlsx}>
            Modelo XLSX
          </Button>
          <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
            Importar
            <input hidden type="file" accept=".csv,.xlsx,.xls" onChange={handleImportFile} />
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
            Novo exercicio
          </Button>
        </>
      }
    >
      <Stack spacing={2.5}>
        {message ? <Alert severity="success">{message}</Alert> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
            <Box>
              <Typography variant="overline" color="text.secondary">Resumo</Typography>
              <Typography variant="h5">Exercicios cadastrados e prontos para montagem</Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`${exercises.length} na lista`} variant="outlined" />
              <Chip label={`${activeCount} ativos`} color="success" />
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Typography variant="overline" color="text.secondary">Filtros</Typography>
          <Box
            sx={{
              mt: 1.25,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr auto" },
              gap: 1,
            }}
          >
            <TextField
              size="small"
              label="Buscar exercicio"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl size="small">
              <InputLabel>Grupo muscular</InputLabel>
              <Select
                label="Grupo muscular"
                value={filters.muscleGroup}
                onChange={(event) => setFilters((current) => ({ ...current, muscleGroup: event.target.value }))}
              >
                <MenuItem value="">Todos</MenuItem>
                {muscleGroups.map((group) => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="inactive">Inativos</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => loadExercises(filters)}>
              Aplicar
            </Button>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Typography variant="overline" color="text.secondary">Biblioteca</Typography>
          <Typography variant="h5" sx={{ mb: 1.5 }}>Lista de exercicios</Typography>
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Exercicio</TableCell>
                  <TableCell>Grupo muscular</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uso em treinos</TableCell>
                  <TableCell>Midia</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{exercise.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exercise.description || exercise.technicalNotes || "Sem descricao adicional."}
                      </Typography>
                    </TableCell>
                    <TableCell>{exercise.muscleGroup}</TableCell>
                    <TableCell>
                      <Chip size="small" color={exercise.isActive ? "success" : "default"} label={exercise.isActive ? "Ativo" : "Inativo"} />
                    </TableCell>
                    <TableCell>{exercise._count.workoutExercises}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {exercise.imageUrl ? <Chip size="small" label="Imagem" variant="outlined" /> : null}
                        {exercise.videoUrl ? <Chip size="small" label="Video" variant="outlined" /> : null}
                        {!exercise.imageUrl && !exercise.videoUrl ? <Typography variant="caption">-</Typography> : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" startIcon={<Edit />} onClick={() => openEditDialog(exercise)}>
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color={exercise.isActive ? "inherit" : "success"}
                          startIcon={exercise.isActive ? <ToggleOff /> : <ToggleOn />}
                          onClick={() => toggleExercise(exercise)}
                        >
                          {exercise.isActive ? "Inativar" : "Reativar"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {headers.length ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
            <Typography variant="overline" color="text.secondary">Importacao</Typography>
            <Typography variant="h5" sx={{ mb: 1.5 }}>Preview e mapeamento de exercicios</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {previewFields.map((field) => (
                <FormControl key={field.key} size="small" fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={mapping[field.key] ?? ""}
                    label={field.label}
                    onChange={(event) => setMapping((current) => ({ ...current, [field.key]: event.target.value }))}
                  >
                    <MenuItem value="">Nao mapear</MenuItem>
                    {headers.map((header) => (
                      <MenuItem key={header} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button variant="outlined" onClick={() => refreshPreview()}>Revalidar preview</Button>
              <Chip label={uploadFileName || "arquivo"} variant="outlined" />
            </Stack>

            {preview ? (
              <>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                  <Chip label={`${preview.summary.validRows} validos`} color="success" />
                  <Chip label={`${preview.summary.invalidRows} invalidos`} color="warning" />
                  <Chip label={`${preview.summary.totalRows} linhas`} variant="outlined" />
                </Stack>
                <TableContainer sx={{ mt: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Linha</TableCell>
                        <TableCell>Exercicio</TableCell>
                        <TableCell>Grupo muscular</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Resultado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preview.rows.map((row) => (
                        <TableRow key={row.rowNumber}>
                          <TableCell>{row.rowNumber}</TableCell>
                          <TableCell>{row.normalized?.name ?? "-"}</TableCell>
                          <TableCell>{row.normalized?.muscleGroup ?? "-"}</TableCell>
                          <TableCell>{row.normalized ? (row.normalized.isActive ? "Ativo" : "Inativo") : "-"}</TableCell>
                          <TableCell>
                            {row.isValid ? (
                              <Chip size="small" color="success" label="Pronto" />
                            ) : (
                              <Stack spacing={0.5}>
                                {row.errors.map((error) => (
                                  <Typography key={`${row.rowNumber}-${error.message}`} variant="caption" color="error">
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
                  <Button variant="contained" disabled={!preview.summary.readyToImport || busy} onClick={confirmImport}>
                    Confirmar importacao
                  </Button>
                  {!preview.summary.readyToImport ? (
                    <Alert severity="info" sx={{ flex: 1 }}>
                      Corrija as linhas invalidas antes de gravar no banco.
                    </Alert>
                  ) : null}
                </Stack>
              </>
            ) : null}
          </Paper>
        ) : null}

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 0.5 }}>
          <Typography variant="overline" color="text.secondary">Historico de importacoes</Typography>
          <Typography variant="h5" sx={{ mb: 1.5 }}>Lotes de exercicios</Typography>
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Arquivo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Linhas</TableCell>
                  <TableCell>Validas</TableCell>
                  <TableCell>Invalidas</TableCell>
                  <TableCell>Conclusao</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{batch.fileName}</Typography>
                      {batch.errors[0] ? (
                        <Typography variant="caption" color="text.secondary">{batch.errors[0].message}</Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={batch.status}
                        color={batch.status === "COMPLETED" ? "success" : batch.status === "FAILED" ? "error" : "warning"}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingExercise ? "Editar exercicio" : "Novo exercicio"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField label="Nome" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <TextField label="Grupo muscular" value={form.muscleGroup} onChange={(event) => setForm((current) => ({ ...current, muscleGroup: event.target.value }))} />
            <TextField label="Descricao" multiline minRows={2} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            <TextField label="Imagem URL" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
            <TextField label="Video URL" value={form.videoUrl} onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))} />
            <TextField label="Notas tecnicas" multiline minRows={2} value={form.technicalNotes} onChange={(event) => setForm((current) => ({ ...current, technicalNotes: event.target.value }))} />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.isActive ? "active" : "inactive"}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.value === "active" }))}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={submitForm} disabled={busy}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </MaterialShell>
  );
}
