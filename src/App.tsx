import CloudUpload from "@mui/icons-material/CloudUpload";
import Message from "@mui/icons-material/Message";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PriceChange from "@mui/icons-material/PriceChange";
import TaskAlt from "@mui/icons-material/TaskAlt";
import TrendingUp from "@mui/icons-material/TrendingUp";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { DashboardCard } from "./material/DashboardCard";
import {
  dashboardClusterGap,
  dashboardGridGap,
  dashboardKpiGridSx,
  dashboardSubGridSx
} from "./material/layout";
import { kpiCardSurfaceGradient } from "./material/surfaces";
import {
  cadenceItems,
  dueSoon,
  overdueRows,
  recentPayments,
  reconciliationQueue,
  topMetrics
} from "./data/homepageMock";
import { MaterialShell } from "./material/MaterialShell";

const actionIcons = [<CloudUpload />, <PersonAdd />, <PriceChange />, <Message />];
const metricIcons = [<TrendingUp fontSize="small" />, <TaskAlt fontSize="small" />, <PriceChange fontSize="small" />, <WarningAmber fontSize="small" />];
const metricProgress = [92, 82, 58, 33];
const metricColor = ["primary", "success", "warning", "error"] as const;
const surfaceCardSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 0.5,
  boxShadow: "none"
};
const cardContentSx = {
  p: { xs: 2, sm: 2.5 },
  "&:last-child": {
    pb: { xs: 2, sm: 2.5 }
  }
};

function statusColor(status: string): "success" | "warning" | "error" {
  if (status === "late") return "error";
  if (status === "pending") return "warning";
  return "success";
}

function paymentStatusLabel(status: string): string {
  if (status === "late") return "Em atraso";
  if (status === "pending") return "Pendente";
  if (status === "paid") return "Pago";
  return status;
}

function App() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const kpiCardSurface = kpiCardSurfaceGradient(theme);
  const tableHeadBg = alpha(theme.palette.text.primary, isDark ? 0.08 : 0.04);
  return (
    <MaterialShell
      eyebrow="Dashboard"
      title="Visão financeira"
      description="Acompanhe caixa, mensalidades abertas e ações de cobrança do dia."
      asideDescription="MVP em validação. Caixa e conciliação no centro."
      actions={["Importar extrato", "Cadastrar aluno", "Criar plano", "Abrir régua de cobrança"].map(
        (action, index) => (
          <Button
            key={action}
            variant={index === 0 ? "contained" : "outlined"}
            color={index === 0 ? "primary" : "inherit"}
            startIcon={actionIcons[index]}
          >
            {action}
          </Button>
        )
      )}
    >
      <Box sx={dashboardKpiGridSx}>
        {topMetrics.map((metric, index) => {
          const color = metricColor[index] ?? "primary";
          const progress = metricProgress[index] ?? 50;
          const icon = metricIcons[index] ?? <TrendingUp fontSize="small" />;

          return (
            <DashboardCard
              key={metric.title}
              fullHeight
              surface="kpi"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                background: kpiCardSurface
              }}
              contentSx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}
            >
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontWeight={900}
                    noWrap
                    sx={{ minWidth: 0 }}
                  >
                    {metric.title}
                  </Typography>
                  <Chip icon={icon} label={`${progress}%`} size="small" color={color} variant="outlined" />
                </Stack>

                <Typography
                  variant="h3"
                  sx={{ mt: 1, lineHeight: 1.08, fontSize: { xs: "1.7rem", sm: "2rem", lg: "1.85rem", xl: "2rem" } }}
                >
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {metric.delta}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color={color}
                  sx={{
                    mt: 1.25,
                    height: 8,
                    borderRadius: 1,
                    bgcolor: "action.hover"
                  }}
                />
            </DashboardCard>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: dashboardClusterGap,
          alignItems: "start"
        }}
      >
        <DashboardCard surface="emphasis">
          <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ display: "block", mb: 1 }}>
            Ações prioritárias
          </Typography>
          <Stack spacing={0.75} divider={<Divider flexItem />}>
            {cadenceItems.map((item) => (
              <Box key={item.window} sx={{ py: 0.5 }}>
                <Stack direction="row" gap={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={800} noWrap sx={{ lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                      {item.window}
                    </Typography>
                  </Box>
                  <Chip label={item.count} color="success" size="small" />
                </Stack>
              </Box>
            ))}
          </Stack>
        </DashboardCard>

        <DashboardCard surface="muted">
          <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ display: "block", mb: 1 }}>
            Próximos a vencer
          </Typography>
          <Stack spacing={0.75} divider={<Divider flexItem />}>
            {dueSoon.slice(0, 4).map((item) => (
              <Stack key={item.student} direction="row" gap={1} sx={{ justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={800} noWrap>
                    {item.student}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.plan}
                  </Typography>
                </Box>
                <Chip label={item.dueIn} size="small" variant="outlined" />
              </Stack>
            ))}
          </Stack>
        </DashboardCard>
      </Box>

      <Stack spacing={dashboardGridGap}>
          <Card sx={surfaceCardSx}>
            <CardContent sx={cardContentSx}>
              <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    Mensalidades em atraso
                  </Typography>
                  <Typography variant="h5">Ações necessárias</Typography>
                </Box>
                <Chip label={`${overdueRows.length} pendências`} color="error" />
              </Stack>
              <TableContainer sx={{ mt: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 0.5, overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead sx={{ bgcolor: tableHeadBg }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Aluno</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Plano</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Vencimento</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overdueRows.map((row) => (
                      <TableRow key={`${row.student}-${row.dueDate}`} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                        <TableCell sx={{ fontWeight: 800 }}>{row.student}</TableCell>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{row.amount}</TableCell>
                        <TableCell>
                          <Chip label={paymentStatusLabel(row.status)} color={statusColor(row.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        <Box sx={dashboardSubGridSx}>
          <Card sx={surfaceCardSx}>
            <CardContent sx={cardContentSx}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Conciliação
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>Pendências</Typography>
              <Stack spacing={1}>
                {reconciliationQueue.map((item) => (
                  <Box key={item.title} sx={{ py: 0.5, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: "none" } }}>
                    <Stack direction="row" gap={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight={800} sx={{ flex: 1, minWidth: 0 }}>
                        {item.title}
                      </Typography>
                      <Chip label={item.badge} color="secondary" size="small" />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={surfaceCardSx}>
            <CardContent sx={cardContentSx}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Pagamentos recentes
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>Últimos 3</Typography>
              <Stack spacing={1}>
                {recentPayments.slice(0, 3).map((row) => (
                  <Box key={`${row.student}-${row.date}`}>
                    <PaperLikePayment row={row} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </MaterialShell>
  );
}

function PaperLikePayment({ row }: { row: { student: string; plan: string; status: string; amount: string } }) {
  const isPaid = row.status === "Pago";

  return (
    <Card variant="outlined" sx={{ boxShadow: "none" }}>
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <Stack direction="row" gap={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} sx={{ lineHeight: 1.2, fontSize: "0.95rem" }}>
              {row.student}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2, display: "block" }}>
              {row.plan}
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={800}>{row.amount}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default App;
