import { Link as RouterLink } from "react-router-dom";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Message from "@mui/icons-material/Message";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PriceChange from "@mui/icons-material/PriceChange";
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

function statusColor(status: string): "success" | "warning" | "error" {
  if (status === "late") return "error";
  if (status === "pending") return "warning";
  return "success";
}

function App() {
  return (
    <MaterialShell
      eyebrow="MVP lean - financeiro-first"
      title="Luis, seu studio esta operando com caixa previsivel e sem planilha."
      description="Esta home foi reposicionada para o MVP real: organizar o dinheiro que ja entra hoje, conciliar extratos, acompanhar mensalidades e reduzir inadimplencia com uma regua manual-assistida."
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
      <Grid container spacing={2}>
        {topMetrics.map((metric) => (
          <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  {metric.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {metric.delta}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    Dashboard financeiro
                  </Typography>
                  <Typography variant="h2">
                    Receita prevista, caixa e conciliacao sem depender de Stripe
                  </Typography>
                </Box>
                <Chip label="Atualizado ha 2 min" color="secondary" variant="outlined" />
              </Stack>

              <Grid container spacing={1.5} sx={{ mt: 2 }}>
                {weeklyCashflow.map((entry) => (
                  <Grid key={entry.day} size={{ xs: 6, md: 2.4 }}>
                    <Card variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography variant="overline" color="text.secondary" fontWeight={900}>
                          {entry.day}
                        </Typography>
                        <Typography variant="h3">{entry.amount}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
                    <CardContent>
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
                    <CardContent>
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
            <CardContent>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={900}>
                Regua manual-assistida
              </Typography>
              <Typography variant="h2">Precisa cobrar hoje</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {cadenceItems.map((item) => (
                  <Card key={item.window} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white", boxShadow: "none" }}>
                    <CardContent>
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

      <Grid container spacing={2}>
        {moduleCards.map((module) => (
          <Grid key={module.title} size={{ xs: 12, md: 6, xl: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardContent>
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

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Recebimentos conciliados
              </Typography>
              <Typography variant="h2">Ultimos recebimentos reconhecidos pelo sistema</Typography>
              <Stack spacing={1.25} sx={{ mt: 2 }}>
                {recentPayments.map((row) => (
                  <PaperLikePayment key={`${row.student}-${row.date}`} row={row} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Conciliacao pendente
                </Typography>
                <Typography variant="h3">O que ainda precisa de decisao manual</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {reconciliationQueue.map((item) => (
                    <Card key={item.title} variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent>
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
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Proximos vencimentos
                </Typography>
                <Typography variant="h3">Quem entra na regua nos proximos dias</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {dueSoon.map((item) => (
                    <Card key={item.student} variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent>
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
  return (
    <Card variant="outlined" sx={{ boxShadow: "none" }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography fontWeight={800}>{row.student}</Typography>
            <Typography variant="body2" color="text.secondary">{row.plan}</Typography>
          </Box>
          <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
            <Chip label={row.status} color={row.status === "Pago" ? "success" : "warning"} size="small" />
            <Typography fontWeight={800}>{row.amount}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default App;
