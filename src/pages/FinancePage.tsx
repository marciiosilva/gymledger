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
  Chip,
  Collapse,
  Divider,
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
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { DashboardCard } from "../material/DashboardCard";
import { dashboardClusterGap, dashboardKpiGridSx, dashboardMainSplitSx, dashboardSectionGap } from "../material/layout";
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

function financeStatusLabel(status: string): string {
  if (status === "paid") return "Conciliado";
  if (status === "pending") return "Pendente";
  if (status === "late") return "Em atraso";
  return status;
}

function badgeColor(tone: string): "success" | "warning" | "secondary" {
  if (tone === "warning") return "warning";
  if (tone === "success") return "success";
  return "secondary";
}

export function FinancePage() {
  const [bookFiltersOpen, setBookFiltersOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const kpiCardSurface = kpiCardSurfaceGradient(theme);
  const filterPanelBg = alpha(theme.palette.text.primary, isDark ? 0.08 : 0.02);
  const tableHeadBg = alpha(theme.palette.text.primary, isDark ? 0.08 : 0.04);
  return (
    <MaterialShell
      eyebrow="Financeiro"
      title="Caixa previsível para decidir rápido."
      description="Acompanhe entradas, saídas, mensalidades abertas e conciliação em uma rotina simples de fechamento."
      asideDescription="Caixa, mensalidades e conciliação para decidir rápido."
      actions={
        <>
          <Button variant="outlined" startIcon={<CloudUpload />}>
            Importar extrato
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar fechamento
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Novo lançamento
          </Button>
        </>
      }
    >
      <Box sx={dashboardKpiGridSx}>
        {financeMetrics.map((metric, index) => {
          const icon = financeMetricIcons[index] ?? <AccountBalance fontSize="small" />;
          const accent = financeMetricAccent[index] ?? "primary.main";

          return (
              <DashboardCard
                key={metric.title}
                surface="kpi"
                fullHeight
                sx={{ background: kpiCardSurface }}
                contentSx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}
              >
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
              </DashboardCard>
          );
        })}
      </Box>

      <Box sx={dashboardMainSplitSx}>
        <Stack spacing={dashboardSectionGap} sx={{ minWidth: 0 }}>
            <DashboardCard>
                <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={900}>
                      Fluxo de caixa
                    </Typography>
                  </Box>
                  <Chip label="Atualizado há 2 min" color="secondary" variant="outlined" />
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(4, minmax(0, 1fr))"
                    },
                    gap: dashboardClusterGap,
                    alignItems: "stretch"
                  }}
                >
                  {cashflowSummary.map((item, index) => {
                    const icon = cashflowIcons[index] ?? <AccountBalance fontSize="small" />;
                    const accent = cashflowAccent[index] ?? "primary.main";

                    return (
                      <DashboardCard
                        key={item.label}
                        sx={{
                          background: kpiCardSurface
                        }}
                        contentSx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}
                      >
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
                      </DashboardCard>
                    );
                  })}
                </Box>
            </DashboardCard>

            <DashboardCard>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Livro-caixa
                </Typography>
                <Typography variant="h2">Lançamentos recentes e conciliação</Typography>

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
                      bgcolor: filterPanelBg
                    }}
                  >
                    <Box sx={{ mt: 0, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr repeat(4, minmax(0, 1fr))" }, gap: 1 }}>
                      <Box>
                        <TextField
                          fullWidth
                          size="small"
                          label="Buscar lançamento"
                          placeholder="Aluno, descrição ou categoria"
                          slotProps={{
                            input: { startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ) }
                          }}
                        />
                      </Box>
                      <Box>
                        <TextField fullWidth size="small" select label="Período" defaultValue="abril">
                          <MenuItem value="abril">Abril 2026</MenuItem>
                          <MenuItem value="marco">Março 2026</MenuItem>
                          <MenuItem value="trimestre">Último trimestre</MenuItem>
                        </TextField>
                      </Box>
                      <Box>
                        <TextField fullWidth size="small" select label="Conta" defaultValue="todas">
                          <MenuItem value="todas">Todas as contas</MenuItem>
                          <MenuItem value="nubank">Nubank PJ</MenuItem>
                          <MenuItem value="itau">Itaú</MenuItem>
                          <MenuItem value="stone">Stone</MenuItem>
                        </TextField>
                      </Box>
                      <Box>
                        <TextField fullWidth size="small" select label="Tipo" defaultValue="todos">
                          <MenuItem value="todos">Entradas e saídas</MenuItem>
                          <MenuItem value="entrada">Entradas</MenuItem>
                          <MenuItem value="saida">Saídas</MenuItem>
                          <MenuItem value="pendentes">Pendentes</MenuItem>
                        </TextField>
                      </Box>
                      <Box>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<FilterList />}
                          sx={{ minHeight: 40, textTransform: "none", fontWeight: 700 }}
                        >
                          Aplicar filtros
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Collapse>

                <TableContainer sx={{ mt: 2, border: "1px solid", borderColor: "divider", borderRadius: 0.5, overflowX: "auto" }}>
                  <Table size="small" sx={{ minWidth: 980 }}>
                    <TableHead sx={{ bgcolor: tableHeadBg }}>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Conta</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
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
                            <Chip label={financeStatusLabel(row.status)} color={statusColor(row.status)} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Conciliar lançamento">
                              <IconButton aria-label={`Conciliar ${row.description}`}>
                                <TaskAlt />
                              </IconButton>
                            </Tooltip>
                            <IconButton aria-label={`Mais ações para ${row.description}`}>
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </DashboardCard>
        </Stack>

        <Stack spacing={dashboardSectionGap} sx={{ minWidth: 0 }}>
            <DashboardCard surface="emphasis" sx={{ color: "text.primary" }}>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Conciliação
                </Typography>
                <Typography variant="h2">Fontes que precisam de decisão</Typography>
                <Stack spacing={1.25} divider={<Divider flexItem />} sx={{ mt: 2 }}>
                  {reconciliationItems.map((item) => (
                    <Box key={item.title} sx={{ py: 0.5 }}>
                      <Stack direction="row" gap={2} sx={{ justifyContent: "space-between", minWidth: 0 }}>
                        <Typography noWrap fontWeight={800} sx={{ minWidth: 0 }}>{item.title}</Typography>
                        <Chip label={item.badge} color={badgeColor(item.tone)} size="small" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
            </DashboardCard>

            <DashboardCard>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Contas a receber
                </Typography>
                <Typography variant="h3">Mensalidades abertas prioritárias</Typography>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {receivableQueue.map((item) => (
                    <Box key={item.student}>
                      <Box sx={{ p: 1.25, border: "1px solid", borderColor: "divider", borderRadius: 0.5 }}>
                          <Stack direction="row" gap={2} sx={{ justifyContent: "space-between", minWidth: 0 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography noWrap fontWeight={800}>{item.student}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.plan} - vence {item.dueDate}
                              </Typography>
                            </Box>
                            <Chip label={financeStatusLabel(item.status)} color={statusColor(item.status)} size="small" />
                          </Stack>
                          <Stack direction="row" sx={{ mt: 1.5, justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h3">{item.amount}</Typography>
                            <Button variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 700 }}>
                              Cobrar
                            </Button>
                          </Stack>
                      </Box>
                    </Box>
                  ))}
                </Stack>
            </DashboardCard>

            <DashboardCard>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Despesas
                </Typography>
                <Typography variant="h3">Composição do custo mensal</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {expenseBreakdown.map((item) => (
                    <Box key={item.label}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", minWidth: 0 }}>
                        <Typography noWrap fontWeight={800} sx={{ minWidth: 0 }}>{item.label}</Typography>
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
                  Registrar despesa
                </Button>
            </DashboardCard>
          </Stack>
      </Box>
    </MaterialShell>
  );
}
