import AccountBalance from "@mui/icons-material/AccountBalance";
import Add from "@mui/icons-material/Add";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Download from "@mui/icons-material/Download";
import FilterList from "@mui/icons-material/FilterList";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import TaskAlt from "@mui/icons-material/TaskAlt";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import {
  cashflowSummary,
  expenseBreakdown,
  financeMetrics,
  receivableQueue,
  reconciliationItems,
  transactionRows
} from "../data/financeMock";
import { MaterialShell } from "../material/MaterialShell";

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
        {financeMetrics.map((metric) => (
          <Grid key={metric.title} size={{ xs: 12, sm: 6, xl: 3 }}>
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
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={900}>
                      Fluxo de caixa
                    </Typography>
                    <Typography variant="h2">Entradas, saidas e saldo atual do mes</Typography>
                  </Box>
                  <Chip label="Atualizado ha 2 min" color="secondary" variant="outlined" />
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  {cashflowSummary.map((item) => (
                    <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 3 }}>
                      <Card variant="outlined" sx={{ boxShadow: "none" }}>
                        <CardContent>
                          <Typography variant="overline" color="text.secondary" fontWeight={900}>
                            {item.label}
                          </Typography>
                          <Typography variant="h3" sx={{ mt: 1 }}>
                            {item.amount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.detail}
                          </Typography>
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
                  Livro caixa
                </Typography>
                <Typography variant="h2">Lancamentos recentes e status de conciliacao</Typography>

                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <TextField
                      fullWidth
                      label="Buscar lancamento"
                      placeholder="Aluno, descricao ou categoria"
                      slotProps={{
                        input: { startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ) }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                    <TextField fullWidth select label="Periodo" defaultValue="abril">
                      <MenuItem value="abril">Abril 2026</MenuItem>
                      <MenuItem value="marco">Marco 2026</MenuItem>
                      <MenuItem value="trimestre">Ultimo trimestre</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                    <TextField fullWidth select label="Conta" defaultValue="todas">
                      <MenuItem value="todas">Todas as contas</MenuItem>
                      <MenuItem value="nubank">Nubank PJ</MenuItem>
                      <MenuItem value="itau">Itau</MenuItem>
                      <MenuItem value="stone">Stone</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                    <TextField fullWidth select label="Tipo" defaultValue="todos">
                      <MenuItem value="todos">Entradas e saidas</MenuItem>
                      <MenuItem value="entrada">Entradas</MenuItem>
                      <MenuItem value="saida">Saidas</MenuItem>
                      <MenuItem value="pendentes">Pendentes</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                    <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: "100%" }}>
                      Filtrar
                    </Button>
                  </Grid>
                </Grid>

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
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {receivableQueue.map((item) => (
                    <Card key={item.student} variant="outlined" sx={{ boxShadow: "none" }}>
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
                          <Button variant="outlined">Cobrar</Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
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
