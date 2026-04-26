import { Link as RouterLink } from "react-router-dom";
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
  Grid,
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
import {
  cadenceItems,
  dueSoon,
  moduleCards,
  overdueRows,
  recentPayments,
  reconciliationQueue,
  topMetrics,
  weeklyCashflow
} from "./data/homepageMock";
import { MaterialShell } from "./material/MaterialShell";

const actionIcons = [<CloudUpload />, <PersonAdd />, <PriceChange />, <Message />];
const sectionSpacing = { xs: 2.25, md: 2 };
const metricIcons = [<TrendingUp fontSize="small" />, <TaskAlt fontSize="small" />, <PriceChange fontSize="small" />, <WarningAmber fontSize="small" />];
const metricProgress = [92, 82, 58, 33];
const metricColor = ["primary", "success", "warning", "error"] as const;
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

function App() {
  return (
    <MaterialShell
      eyebrow="Dashboard"
      title="Caixa do studio sob controle."
      description="Acompanhe receita, conciliacao e inadimplencia do dia em um painel direto para decidir a proxima acao."
      asideTitle="Hipotese em validacao"
      asideDescription="MVP lean ativo. Sem gateway obrigatorio, com caixa e conciliacao no centro."
      actions={["Importar extrato", "Cadastrar aluno", "Criar plano", "Abrir regua de cobranca"].map(
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
      <Grid container spacing={sectionSpacing}>
        {topMetrics.map((metric, index) => {
          const color = metricColor[index] ?? "primary";
          const progress = metricProgress[index] ?? 50;
          const icon = metricIcons[index] ?? <TrendingUp fontSize="small" />;

          return (
            <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: 2.4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,250,249,0.9) 100%)"
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 1.75 }, "&:last-child": { pb: { xs: 1.5, sm: 1.75 } } }}>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={900}
                      sx={{ letterSpacing: 0.4 }}
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, minHeight: 38 }}>
                    {metric.delta}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={color}
                    sx={{
                      mt: 1.25,
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "action.hover"
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={sectionSpacing}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent sx={cardContentSx}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                gap={{ xs: 1.5, md: 2 }}
                sx={{ justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    Dashboard financeiro
                  </Typography>
                  <Typography
                    component="h2"
                    sx={{
                      mt: 0.5,
                      fontSize: { xs: "2.2rem", sm: "2.6rem", md: "3.4rem" },
                      lineHeight: { xs: 1.15, sm: 1.1 },
                      letterSpacing: "-0.02em"
                    }}
                  >
                    Receita prevista, caixa e conciliacao sem depender de Stripe
                  </Typography>
                </Box>
                <Chip
                  label="Atualizado ha 2 min"
                  color="secondary"
                  variant="outlined"
                  sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                />
              </Stack>

              <Grid container spacing={{ xs: 1.75, md: 1.5 }} sx={{ mt: 2 }}>
                {weeklyCashflow.map((entry) => (
                  <Grid key={entry.day} size={{ xs: 6, md: 2.4 }}>
                    <Card variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent sx={cardContentSx}>
                        <Typography variant="overline" color="text.secondary" fontWeight={900}>
                          {entry.day}
                        </Typography>
                        <Typography variant="h3">{entry.amount}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={sectionSpacing} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
                    <CardContent sx={cardContentSx}>
                      <Typography variant="overline" color="text.secondary" fontWeight={900}>
                        O que valida o MVP
                      </Typography>
                      <Stack spacing={1.25} sx={{ mt: 1 }}>
                        {[
                          "Upload de CSV ou OFX com conciliacao semiautomatica.",
                          "Livro-caixa com entradas, saidas e saldo real do mes.",
                          "Mensalidades previsiveis por plano e status financeiro por aluno."
                        ].map((item) => (
                          <Typography key={item} variant="body2" color="text.secondary">
                            {item}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
                    <CardContent sx={cardContentSx}>
                      <Typography variant="overline" color="text.secondary" fontWeight={900}>
                        Aprendizado da semana
                      </Typography>
                      <Stack direction="row" gap={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Chip label="10 matches automaticos" color="success" />
                        <Chip label="4 conciliacoes manuais" color="warning" />
                        <Chip label="3 exportacoes" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        A home evidencia o ciclo build-measure-learn do MVP, em vez de vender
                        modulos que o plano colocou para depois.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Card sx={{ height: "100%", bgcolor: "#102017", color: "white" }}>
            <CardContent sx={cardContentSx}>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={900}>
                Regua manual-assistida
              </Typography>
              <Typography variant="h2">Precisa cobrar hoje</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {cadenceItems.map((item) => (
                  <Card key={item.window} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white", boxShadow: "none" }}>
                    <CardContent sx={cardContentSx}>
                      <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.62)" }}>
                            {item.window}
                          </Typography>
                          <Typography fontWeight={800}>{item.title}</Typography>
                        </Box>
                        <Chip label={item.count} color="success" size="small" />
                      </Stack>
                      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                        {item.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={sectionSpacing}>
        {moduleCards.map((module) => (
          <Grid key={module.title} size={{ xs: 12, md: 6, xl: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={cardContentSx}>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  {module.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {module.stat}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {module.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={sectionSpacing}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent sx={cardContentSx}>
              <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    Top 5 atrasados
                  </Typography>
                  <Typography variant="h2">Mensalidades vencidas que pedem acao imediata</Typography>
                </Box>
                <Chip label={`${overdueRows.length} casos prioritarios`} color="warning" />
              </Stack>
              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Aluno</TableCell>
                      <TableCell>Plano</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overdueRows.map((row) => (
                      <TableRow key={`${row.student}-${row.dueDate}`}>
                        <TableCell sx={{ fontWeight: 800 }}>{row.student}</TableCell>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{row.amount}</TableCell>
                        <TableCell>
                          <Chip label={row.status} color={statusColor(row.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card sx={{ mt: { xs: 2.25, md: 2 } }}>
            <CardContent sx={cardContentSx}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Recebimentos conciliados
              </Typography>
              <Typography variant="h2">Ultimos recebimentos reconhecidos pelo sistema</Typography>
              <Grid container spacing={{ xs: 1, md: 1.25 }} sx={{ mt: 2 }}>
                {recentPayments.map((row) => (
                  <Grid key={`${row.student}-${row.date}`} size={{ xs: 12, sm: 4 }}>
                    <PaperLikePayment row={row} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={{ xs: 2.25, md: 2 }}>
            <Card>
              <CardContent sx={cardContentSx}>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Conciliacao pendente
                </Typography>
                <Typography variant="h3">O que ainda precisa de decisao manual</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {reconciliationQueue.map((item) => (
                    <Card key={item.title} variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent sx={cardContentSx}>
                        <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Chip label={item.badge} color="secondary" size="small" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={cardContentSx}>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Proximos vencimentos
                </Typography>
                <Typography variant="h3">Quem entra na regua nos proximos dias</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {dueSoon.map((item) => (
                    <Card key={item.student} variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent sx={cardContentSx}>
                        <Typography fontWeight={800}>{item.student}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.plan}</Typography>
                        <Chip label={item.dueIn} size="small" sx={{ mt: 1 }} />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button component={RouterLink} to="/ds" variant="text">
          Ver Design System
        </Button>
      </Box>
    </MaterialShell>
  );
}

function PaperLikePayment({ row }: { row: { student: string; plan: string; status: string; amount: string } }) {
  const isPaid = row.status === "Pago";

  return (
    <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
      <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, "&:last-child": { pb: { xs: 1.25, sm: 1.5 } } }}>
        <Stack direction="row" gap={1.25} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} sx={{ lineHeight: 1.2, fontSize: { xs: "1rem", sm: "1.05rem" } }}>
              {row.student}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, fontSize: "0.82rem" }}>
              {row.plan}
            </Typography>
            <Chip
              label={row.status}
              color={isPaid ? "success" : "warning"}
              size="small"
              sx={{ mt: 0.6, borderRadius: 1.5, height: 22, fontWeight: 700, fontSize: "0.68rem" }}
            />
          </Box>

          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.66rem" }}>
              Valor
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 0.2,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "1.35rem", sm: "1.4rem" }
              }}
            >
              {row.amount}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default App;
