import Download from "@mui/icons-material/Download";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterList from "@mui/icons-material/FilterList";
import MoreVert from "@mui/icons-material/MoreVert";
import Paid from "@mui/icons-material/Paid";
import PersonAdd from "@mui/icons-material/PersonAdd";
import People from "@mui/icons-material/People";
import Search from "@mui/icons-material/Search";
import Send from "@mui/icons-material/Send";
import TrendingDown from "@mui/icons-material/TrendingDown";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  attentionQueue,
  planMix,
  studentMetrics,
  studentRows,
  studentSegments
} from "../data/studentsMock";
import { MaterialShell } from "../material/MaterialShell";

const studentMetricIcons = [
  <People fontSize="small" />,
  <WarningAmber fontSize="small" />,
  <Paid fontSize="small" />,
  <TrendingDown fontSize="small" />
];

const studentMetricAccent = ["primary.main", "warning.main", "success.main", "error.main"] as const;

function statusColor(status: string): "success" | "warning" | "error" | "default" {
  if (status === "late") return "error";
  if (status === "pending") return "warning";
  if (status === "inactive") return "default";
  return "success";
}

export function StudentsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const planMixTotal = useMemo(() => planMix.reduce((sum, plan) => sum + plan.count, 0), []);

  return (
    <MaterialShell
      eyebrow="Alunos"
      title="Alunos, caixa e retencao juntos."
      description="Veja quem esta ativo, quem precisa de cobranca e quais alunos pedem acompanhamento hoje."
      asideTitle="Foco operacional"
      asideDescription="Base de alunos conectada ao caixa, cobranca e retencao."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar CSV
          </Button>
          <Button variant="contained" startIcon={<PersonAdd />}>
            Novo aluno
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        {studentMetrics.map((metric, index) => {
          const icon = studentMetricIcons[index] ?? <People fontSize="small" />;
          const accent = studentMetricAccent[index] ?? "primary.main";

          return (
            <Grid key={metric.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 0.5,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,249,0.92) 100%)"
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={900}>
                      {metric.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 0.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "action.hover",
                        color: accent
                      }}
                    >
                      {icon}
                    </Box>
                  </Stack>
                  <Typography variant="h4" sx={{ mt: 0.8, lineHeight: 1.08 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {metric.delta}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card sx={{ borderRadius: 0.5 }}>
            <CardContent>
              <Stack direction={{ xs: "column", lg: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    Cadastro e acompanhamento
                  </Typography>
                  <Typography variant="h2">
                    Alunos priorizados por status financeiro e frequencia
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                gap={1}
                sx={{ mt: 1.5, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between" }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setFiltersOpen((open) => !open)}
                  endIcon={
                    <ExpandMore
                      sx={{
                        transition: "transform 160ms ease",
                        transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    />
                  }
                  sx={{ alignSelf: { xs: "flex-end", md: "center" }, textTransform: "none", fontWeight: 700 }}
                >
                  {filtersOpen ? "Minimizar filtros" : "Expandir filtros"}
                </Button>
              </Stack>

              <Collapse in={filtersOpen} timeout="auto">
                <Box
                  sx={{
                    mt: 1.5,
                    p: { xs: 1.25, md: 1.5 },
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 0.5,
                    bgcolor: "rgba(17,24,39,0.02)"
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Segmentos
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.75,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75
                    }}
                  >
                    {studentSegments.map((segment) => (
                      <Chip
                        key={segment.label}
                        label={`${segment.label} ${segment.count}`}
                        color={segment.active ? "primary" : "default"}
                        variant={segment.active ? "filled" : "outlined"}
                        size="small"
                        sx={{ borderRadius: 0.5, fontWeight: 700 }}
                      />
                    ))}
                  </Box>

                  <Grid container spacing={1.25} sx={{ mt: 1.25 }}>
                    <Grid size={{ xs: 12, lg: 5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Buscar aluno"
                        placeholder="Nome, telefone ou plano"
                        slotProps={{
                          input: { startAdornment: (
                            <InputAdornment position="start">
                              <Search fontSize="small" />
                            </InputAdornment>
                          ) }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
                      <TextField fullWidth size="small" select label="Plano" defaultValue="todos">
                        <MenuItem value="todos">Todos os planos</MenuItem>
                        <MenuItem value="studio">Studio Mensal</MenuItem>
                        <MenuItem value="funcional">Funcional</MenuItem>
                        <MenuItem value="cross">Cross Premium</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
                      <TextField fullWidth size="small" select label="Status" defaultValue="todos">
                        <MenuItem value="todos">Todos os status</MenuItem>
                        <MenuItem value="active">Ativos</MenuItem>
                        <MenuItem value="pending">Pendentes</MenuItem>
                        <MenuItem value="late">Atrasados</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<FilterList />}
                        sx={{ minHeight: 40, textTransform: "none", fontWeight: 700 }}
                      >
                        Aplicar filtros
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Aluno</TableCell>
                      <TableCell>Plano</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Financeiro</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Ultimo check-in</TableCell>
                      <TableCell align="right">Acoes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentRows.map((student) => (
                      <TableRow key={student.name}>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: "primary.light",
                                color: "primary.dark",
                                display: "grid",
                                placeItems: "center",
                                fontWeight: 900
                              }}
                            >
                              {student.initials}
                            </Box>
                            <Box>
                              <Typography fontWeight={800}>{student.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Canal: {student.channel}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{student.plan}</TableCell>
                        <TableCell>
                          <Chip label={student.status} color={statusColor(student.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.financialStatus}
                            color={statusColor(student.financialStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{student.dueDate}</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{student.amount}</TableCell>
                        <TableCell>{student.lastCheckIn}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Enviar cobranca ou lembrete">
                            <IconButton aria-label={`Enviar mensagem para ${student.name}`}>
                              <Send />
                            </IconButton>
                          </Tooltip>
                          <IconButton aria-label={`Mais acoes para ${student.name}`}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={2}>
            <Card sx={{ bgcolor: "#102017", color: "white", borderRadius: 0.5 }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={900}>
                  Fila de atencao
                </Typography>
                <Typography variant="h2">Proximas acoes sugeridas</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {attentionQueue.map((item) => (
                    <Card
                      key={item.title}
                      sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white", boxShadow: "none", borderRadius: 0.5 }}
                    >
                      <CardContent>
                        <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Chip label={item.badge} color="success" size="small" />
                        </Stack>
                        <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.72)" }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 0.5 }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }} gap={1.5}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={900}>
                      Mix de planos
                    </Typography>
                    <Typography variant="h3" sx={{ mt: 0.25, lineHeight: 1.12 }}>
                      Receita recorrente por produto
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    variant="outlined"
                    color="default"
                    label={`${planMixTotal} alunos ativos (mix)`}
                    sx={{ fontWeight: 800, height: 26 }}
                  />
                </Stack>
                <Stack
                  sx={{
                    mt: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 0.5,
                    overflow: "hidden"
                  }}
                >
                  {planMix.map((plan) => {
                    const share = planMixTotal > 0 ? (plan.count / planMixTotal) * 100 : 0;
                    return (
                      <Box
                        key={plan.plan}
                        sx={{
                          p: 1.25,
                          borderTop: "1px solid",
                          borderColor: "divider",
                          "&:first-of-type": { borderTop: 0 }
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          gap={{ xs: 1, md: 1.5 }}
                          sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between" }}
                        >
                          <Stack
                            direction="row"
                            gap={1.5}
                            sx={{ alignItems: "center", flexWrap: "wrap", minWidth: 0, rowGap: 0.5, columnGap: 1.5 }}
                          >
                            <Typography fontWeight={800} sx={{ minWidth: 0, pr: 0.25 }}>
                              {plan.plan}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${plan.count} alunos`}
                              sx={{ height: 24, fontWeight: 800, borderRadius: 0.5, ml: 0.25 }}
                              variant="outlined"
                              color="default"
                            />
                          </Stack>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            gap={1}
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              alignItems: { xs: "stretch", sm: "center" },
                              justifyContent: { md: "center" }
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={share}
                              color="primary"
                              sx={{
                                width: { xs: "100%", sm: "100%", md: 220, lg: 280 },
                                maxWidth: { xs: "100%", sm: 420 },
                                height: 6,
                                borderRadius: 1,
                                bgcolor: "action.hover"
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                                textAlign: { xs: "left", sm: "center" }
                              }}
                            >
                              {Math.round(share)}% do mix
                            </Typography>
                          </Stack>

                          <Typography
                            sx={{
                              fontWeight: 900,
                              lineHeight: 1.1,
                              fontSize: { xs: "1.1rem", md: "1.05rem" },
                              textAlign: { xs: "left", md: "right" },
                              flexShrink: 0
                            }}
                          >
                            {plan.revenue}
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </MaterialShell>
  );
}
