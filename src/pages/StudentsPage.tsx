import Download from "@mui/icons-material/Download";
import FilterList from "@mui/icons-material/FilterList";
import MoreVert from "@mui/icons-material/MoreVert";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Search from "@mui/icons-material/Search";
import Send from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
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
  attentionQueue,
  planMix,
  studentMetrics,
  studentRows,
  studentSegments
} from "../data/studentsMock";
import { MaterialShell } from "../material/MaterialShell";

function statusColor(status: string): "success" | "warning" | "error" | "default" {
  if (status === "late") return "error";
  if (status === "pending") return "warning";
  if (status === "inactive") return "default";
  return "success";
}

export function StudentsPage() {
  return (
    <MaterialShell
      eyebrow="Alunos"
      title="Base de alunos com financeiro e retencao no mesmo lugar."
      description="Uma visao de operacao para saber quem esta ativo, quem precisa ser cobrado, quem reduziu frequencia e qual acao deve acontecer hoje."
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
        {studentMetrics.map((metric) => (
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
          <Card>
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
                <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
                  {studentSegments.map((segment) => (
                    <Chip
                      key={segment.label}
                      label={`${segment.label} ${segment.count}`}
                      color={segment.active ? "primary" : "default"}
                      variant={segment.active ? "filled" : "outlined"}
                    />
                  ))}
                </Stack>
              </Stack>

              <Grid container spacing={1.5} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <TextField
                    fullWidth
                    label="Buscar aluno"
                    placeholder="Nome, telefone ou plano"
                    slotProps={{
                      input: { startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ) }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
                  <TextField fullWidth select label="Plano" defaultValue="todos">
                    <MenuItem value="todos">Todos os planos</MenuItem>
                    <MenuItem value="studio">Studio Mensal</MenuItem>
                    <MenuItem value="funcional">Funcional</MenuItem>
                    <MenuItem value="cross">Cross Premium</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
                  <TextField fullWidth select label="Status" defaultValue="todos">
                    <MenuItem value="todos">Todos os status</MenuItem>
                    <MenuItem value="active">Ativos</MenuItem>
                    <MenuItem value="pending">Pendentes</MenuItem>
                    <MenuItem value="late">Atrasados</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, lg: 2 }}>
                  <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: "100%" }}>
                    Filtrar
                  </Button>
                </Grid>
              </Grid>

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
            <Card sx={{ bgcolor: "#102017", color: "white" }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={900}>
                  Fila de atencao
                </Typography>
                <Typography variant="h2">Proximas acoes sugeridas</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {attentionQueue.map((item) => (
                    <Card key={item.title} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white", boxShadow: "none" }}>
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

            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight={900}>
                  Mix de planos
                </Typography>
                <Typography variant="h3">Receita recorrente por produto</Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {planMix.map((plan) => (
                    <Card key={plan.plan} variant="outlined" sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Stack direction="row" gap={2} sx={{ justifyContent: "space-between" }}>
                          <Box>
                            <Typography fontWeight={800}>{plan.plan}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {plan.count} alunos ativos
                            </Typography>
                          </Box>
                          <Chip label={plan.revenue} color="secondary" size="small" />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </MaterialShell>
  );
}
