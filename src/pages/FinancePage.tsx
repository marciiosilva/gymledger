import AccountBalance from "@mui/icons-material/AccountBalance";
import Add from "@mui/icons-material/Add";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Download from "@mui/icons-material/Download";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterList from "@mui/icons-material/FilterList";
import MoreVert from "@mui/icons-material/MoreVert";
import PendingActions from "@mui/icons-material/PendingActions";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import Search from "@mui/icons-material/Search";
import TaskAlt from "@mui/icons-material/TaskAlt";
import TrendingDown from "@mui/icons-material/TrendingDown";
import TrendingUp from "@mui/icons-material/TrendingUp";
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
  LinearProgress,
  MenuItem,
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
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { kpiCardSurfaceGradient } from "../material/surfaces";
import {
  cashflowSummary,
  expenseBreakdown,
  financeMetrics,
  receivableQueue,
  reconciliationItems,
  transactionRows
} from "../data/financeMock";
import { MaterialShell } from "../material/MaterialShell";

const financeMetricIcons = [
  <TaskAlt fontSize="small" />,
  <PendingActions fontSize="small" />,
  <ReceiptLong fontSize="small" />,
  <WarningAmber fontSize="small" />
];

const financeMetricAccent = ["primary.main", "info.main", "text.secondary", "warning.main"] as const;

const cashflowIcons = [
  <TrendingUp fontSize="small" />,
  <TaskAlt fontSize="small" />,
  <TrendingDown fontSize="small" />,
  <AccountBalance fontSize="small" />
];

const cashflowAccent = ["success.main", "primary.main", "warning.main", "info.main"] as const;

function statusColor(status: string): "success" | "warning" | "error" {
  if (status === "late") return "error";
  if (status === "pending") return "warning";
  return "success";
}

function badgeColor(tone: string): "success" | "warning" | "secondary" {
  if (tone === "warning") return "warning";
  if (tone === "success") return "success";
  return "secondary";
}

export function FinancePage() {
  const [bookFiltersOpen, setBookFiltersOpen] = useState(false);
  const theme = useTheme();
  const kpiCardSurface = kpiCardSurfaceGradient(theme);

  return (
    <MaterialShell
      eyebrow="Financeiro"
      title="Caixa previsivel, decisao rapida."
      description="Controle entradas, saidas, mensalidades abertas e conciliacao em uma rotina simples de fechamento."
      asideTitle="Fechamento do mes"
      asideDescription="Caixa, mensalidades e conciliacao com decisao rapida."
      actions={
        <>
          <Button variant="outlined" startIcon={<CloudUpload />}>
            Importar extrato
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar fechamento
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Novo lancamento
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        {financeMetrics.map((metric, index) => {
          const icon = financeMetricIcons[index] ?? <AccountBalance fontSize="small" />;
          const accent = financeMetricAccent[index] ?? "primary.main";

          return (
            <Grid key={metric.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 0.5,
                  background: kpiCardSurface
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
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={900}>
                      Fluxo de caixa
                    </Typography>
                  </Box>
                  <Chip label="Atualizado ha 2 min" color="secondary" variant="outlined" />
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  {cashflowSummary.map((item, index) => {
                    const icon = cashflowIcons[index] ?? <AccountBalance fontSize="small" />;
                    const accent = cashflowAccent[index] ?? "primary.main";

                    return (
                      <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            boxShadow: "none",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 0.5,
                            background: kpiCardSurface
                          }}
                        >
                          <CardContent sx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}>
                            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                                {item.label}
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
                              {item.amount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                              {item.detail}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Livro caixa
                </Typography>
                <Typography variant="h2">Lancamentos recentes e status de conciliacao</Typography>

                <Stack direction="row" sx={{ mt: 1.5, alignItems: "center", justifyContent: "flex-end" }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setBookFiltersOpen((open) => !open)}
                    endIcon={
                      <ExpandMore
                        sx={{
                          transition: "transform 160ms ease",
                          transform: bookFiltersOpen ? "rotate(180deg)" : "rotate(0deg)"
                        }}
                      />
                    }
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    {bookFiltersOpen ? "Minimizar filtros" : "Expandir filtros"}
                  </Button>
                </Stack>

                <Collapse in={bookFiltersOpen} timeout="auto">
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
                    <Grid container spacing={1.25} sx={{ mt: 0 }}>
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Buscar lancamento"
                          placeholder="Aluno, descricao ou categoria"
                          slotProps={{
                            input: { startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ) }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                        <TextField fullWidth size="small" select label="Periodo" defaultValue="abril">
                          <MenuItem value="abril">Abril 2026</MenuItem>
                          <MenuItem value="marco">Marco 2026</MenuItem>
                          <MenuItem value="trimestre">Ultimo trimestre</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                        <TextField fullWidth size="small" select label="Conta" defaultValue="todas">
                          <MenuItem value="todas">Todas as contas</MenuItem>
                          <MenuItem value="nubank">Nubank PJ</MenuItem>
                          <MenuItem value="itau">Itau</MenuItem>
                          <MenuItem value="stone">Stone</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                        <TextField fullWidth size="small" select label="Tipo" defaultValue="todos">
                          <MenuItem value="todos">Entradas e saidas</MenuItem>
                          <MenuItem value="entrada">Entradas</MenuItem>
                          <MenuItem value="saida">Saidas</MenuItem>
                          <MenuItem value="pendentes">Pendentes</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
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
                        <TableCell>Data</TableCell>
                        <TableCell>Descricao</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Conta</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Acoes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionRows.map((row) => (
                        <TableRow key={`${row.date}-${row.description}`}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>{row.description}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.account}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.type}
                              color={row.type === "Entrada" ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>{row.amount}</TableCell>
                          <TableCell>
                            <Chip label={row.status} color={statusColor(row.status)} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Conciliar lancamento">
                              <IconButton aria-label={`Conciliar ${row.description}`}>
                                <TaskAlt />
                              </IconButton>
                            </Tooltip>
                            <IconButton aria-label={`Mais acoes para ${row.description}`}>
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
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={2}>
            <Card sx={{ bgcolor: "#102017", color: "white" }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={900}>
                  Conciliacao
                </Typography>
                <Typography variant="h2">Fontes que precisam de decisao</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {reconciliationItems.map((item) => (
                    <Card key={item.title} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white", boxShadow: "none" }}>
                      <CardContent>
                        <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Chip label={item.badge} color={badgeColor(item.tone)} size="small" />
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

            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Contas a receber
                </Typography>
                <Typography variant="h3">Mensalidades abertas prioritarias</Typography>
                <Grid container spacing={1.25} sx={{ mt: 2 }}>
                  {receivableQueue.map((item) => (
                    <Grid key={item.student} size={{ xs: 12, sm: 6 }}>
                      <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
                        <CardContent>
                          <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                            <Box>
                              <Typography fontWeight={800}>{item.student}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.plan} - vence {item.dueDate}
                              </Typography>
                            </Box>
                            <Chip label={item.status} color={statusColor(item.status)} size="small" />
                          </Stack>
                          <Stack direction="row" sx={{ mt: 1.5, justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h3">{item.amount}</Typography>
                            <Button variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 700 }}>
                              Cobrar
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Despesas
                </Typography>
                <Typography variant="h3">Composicao do custo mensal</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {expenseBreakdown.map((item) => (
                    <Box key={item.label}>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography fontWeight={800}>{item.label}</Typography>
                        <Typography fontWeight={800}>{item.amount}</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Number(item.share.replace("%", ""))}
                        sx={{ mt: 1, height: 8, borderRadius: 999 }}
                      />
                    </Box>
                  ))}
                </Stack>
                <Button fullWidth variant="outlined" startIcon={<AccountBalance />} sx={{ mt: 2 }}>
                  Lancar despesa
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </MaterialShell>
  );
}
