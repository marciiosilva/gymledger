import { Link } from "react-router-dom";
import { Download, Filter, MoreHorizontal, Plus, Search, Send, UserPlus } from "lucide-react";
import {
  attentionQueue,
  planMix,
  studentMetrics,
  studentRows,
  studentSegments
} from "../data/studentsMock";
import { MetricCard } from "../design-system/patterns/MetricCard/MetricCard";
import { SidebarNav } from "../design-system/patterns/SidebarNav/SidebarNav";
import { Badge } from "../design-system/primitives/Badge/Badge";
import { Button } from "../design-system/primitives/Button/Button";
import { Card } from "../design-system/primitives/Card/Card";
import { Dropdown } from "../design-system/primitives/Dropdown/Dropdown";
import { Input } from "../design-system/primitives/Input/Input";
import { Select } from "../design-system/primitives/Select/Select";
import { StatusBadge } from "../design-system/primitives/StatusBadge/StatusBadge";
import { Table } from "../design-system/primitives/Table/Table";
import { Tooltip } from "../design-system/primitives/Tooltip/Tooltip";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Alunos", href: "/alunos", active: true, badge: 148 },
  { label: "Financeiro", badge: 23 },
  { label: "Planos" },
  { label: "Relatorios" }
];

const planOptions = [
  { value: "todos", label: "Todos os planos" },
  { value: "studio", label: "Studio Mensal" },
  { value: "funcional", label: "Funcional" },
  { value: "cross", label: "Cross Premium" },
  { value: "pilates", label: "Pilates Duo" }
];

const statusOptions = [
  { value: "todos", label: "Todos os status" },
  { value: "active", label: "Ativos" },
  { value: "pending", label: "Pendentes" },
  { value: "late", label: "Atrasados" },
  { value: "inactive", label: "Inativos" }
];

export function StudentsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(30,182,74,0.08),transparent_22rem),radial-gradient(circle_at_80%_10%,rgba(6,23,53,0.08),transparent_18rem),linear-gradient(180deg,#fbfcfe_0%,#f3f6fa_100%)] text-[var(--color-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-[rgba(255,255,255,0.06)] bg-[radial-gradient(circle_at_top,rgba(31,174,127,0.12),transparent_22rem),linear-gradient(180deg,#112b4d_0%,#17365d_58%,#1a3d63_100%)] px-5 py-6 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-start gap-4">
            <img
              className="brand-logo mt-1"
              src="/branding/gymledger-logo.svg"
              alt="Logo GymLedger"
              width="64"
              height="64"
            />
            <div>
              <p className="m-0 font-display text-[1.2rem] font-[700] text-white">
                GymLedger
              </p>
              <p className="m-0 max-w-[22ch] text-sm leading-6 text-white/70">
                Controle financeiro. Performance real.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[var(--radius-xl)] border border-white/12 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-sm">
              <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/65">
                Conta principal
              </p>
              <strong className="mt-2 block font-display text-lg text-white">
                Studio Nova Era
              </strong>
              <p className="m-0 mt-2 text-sm leading-6 text-white/70">
                Base de alunos conectada ao caixa, cobranca e retencao.
              </p>
            </div>

            <SidebarNav items={navItems} />

            <div className="rounded-[var(--radius-xl)] border border-white/12 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-sm">
              <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/65">
                Foco operacional
              </p>
              <p className="m-0 mt-2 text-sm leading-6 text-white/78">
                Cada aluno mostra plano, saude financeira, frequencia recente e proxima acao.
              </p>
            </div>
          </div>
        </aside>

        <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
          <div className="mx-auto grid max-w-[1440px] gap-6">
            <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-[760px]">
                <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-accent-active)]">
                  Alunos
                </p>
                <h1 className="m-0 mt-3 max-w-[14ch] font-display text-[clamp(2.25rem,4vw,3.85rem)] leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)]">
                  Base de alunos com financeiro e retencao no mesmo lugar.
                </h1>
                <p className="m-0 mt-4 max-w-[66ch] text-[var(--text-base)] leading-7 text-[var(--color-text-muted)]">
                  Uma visao de operacao para saber quem esta ativo, quem precisa ser cobrado,
                  quem reduziu frequencia e qual acao deve acontecer hoje.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[520px] xl:justify-end">
                <Button variant="secondary" size="md">
                  <Download className="size-4" />
                  Exportar CSV
                </Button>
                <Button variant="primary" size="md">
                  <UserPlus className="size-4" />
                  Novo aluno
                </Button>
              </div>
            </header>

            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Indicadores de alunos"
            >
              {studentMetrics.map((metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  delta={metric.delta}
                  variant={metric.tone}
                  trend={metric.trend}
                />
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_380px]">
              <Card variant="elevated">
                <Card.Header className="flex-col gap-5 pb-0 xl:flex-row">
                  <div>
                    <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      Cadastro e acompanhamento
                    </p>
                    <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em]">
                      Alunos priorizados por status financeiro e frequencia
                    </h2>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:justify-end">
                    {studentSegments.map((segment) => (
                      <Button
                        key={segment.label}
                        variant={segment.active ? "primary" : "secondary"}
                        size="sm"
                      >
                        {segment.label}
                        <Badge variant={segment.active ? "neutral" : "info"} size="sm">
                          {segment.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </Card.Header>

                <Card.Body className="grid gap-5 pt-5">
                  <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_auto]">
                    <Input
                      aria-label="Buscar aluno"
                      placeholder="Buscar por nome, telefone ou plano"
                      leadingIcon={<Search className="size-4" />}
                    />
                    <Select options={planOptions} defaultValue="todos" />
                    <Select options={statusOptions} defaultValue="todos" />
                    <Button variant="secondary" size="md" className="justify-center">
                      <Filter className="size-4" />
                      Filtrar
                    </Button>
                  </div>

                  <Table density="compact">
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Aluno</Table.HeaderCell>
                        <Table.HeaderCell>Plano</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Financeiro</Table.HeaderCell>
                        <Table.HeaderCell>Vencimento</Table.HeaderCell>
                        <Table.HeaderCell>Valor</Table.HeaderCell>
                        <Table.HeaderCell>Ultimo check-in</Table.HeaderCell>
                        <Table.HeaderCell className="text-right">Acoes</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {studentRows.map((student) => (
                        <Table.Row key={student.name}>
                          <Table.Cell>
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-soft)] font-display text-sm font-[800] text-[var(--color-accent-active)]">
                                {student.initials}
                              </span>
                              <div>
                                <strong className="block font-display text-sm">
                                  {student.name}
                                </strong>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  Canal: {student.channel}
                                </span>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell>{student.plan}</Table.Cell>
                          <Table.Cell>
                            <StatusBadge status={student.status} size="sm" />
                          </Table.Cell>
                          <Table.Cell>
                            <StatusBadge status={student.financialStatus} size="sm" />
                          </Table.Cell>
                          <Table.Cell>{student.dueDate}</Table.Cell>
                          <Table.Cell className="font-[700]">{student.amount}</Table.Cell>
                          <Table.Cell>{student.lastCheckIn}</Table.Cell>
                          <Table.Cell>
                            <div className="flex justify-end gap-1">
                              <Tooltip content="Enviar cobranca ou lembrete">
                                <Button variant="ghost" size="sm" aria-label={`Enviar mensagem para ${student.name}`}>
                                  <Send className="size-4" />
                                </Button>
                              </Tooltip>
                              <Dropdown>
                                <Dropdown.Trigger asChild>
                                  <Button variant="ghost" size="sm" aria-label={`Mais acoes para ${student.name}`}>
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                  <Dropdown.Label>{student.name}</Dropdown.Label>
                                  <Dropdown.Item>Ver perfil</Dropdown.Item>
                                  <Dropdown.Item>Registrar pagamento</Dropdown.Item>
                                  <Dropdown.Item>Adicionar observacao</Dropdown.Item>
                                  <Dropdown.Separator />
                                  <Dropdown.Item destructive>Inativar aluno</Dropdown.Item>
                                </Dropdown.Content>
                              </Dropdown>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card.Body>
              </Card>

              <div className="grid gap-4">
                <Card variant="dark">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/70">
                        Fila de atencao
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.55rem] leading-[1.06] tracking-[-0.04em] text-white">
                        Proximas acoes sugeridas
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {attentionQueue.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[var(--radius-lg)] border border-white/8 bg-white/6 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <strong className="font-display text-base text-white">
                            {item.title}
                          </strong>
                          <Badge variant="success" size="sm">
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="m-0 mt-2 text-sm leading-6 text-white/70">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                <Card variant="tinted">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Mix de planos
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.45rem] leading-[1.08] tracking-[-0.04em]">
                        Receita recorrente por produto
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {planMix.map((plan) => (
                      <div
                        key={plan.plan}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <strong className="font-display text-base">{plan.plan}</strong>
                            <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
                              {plan.count} alunos ativos
                            </p>
                          </div>
                          <Badge variant="info" size="sm">
                            {plan.revenue}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm">
                      <Plus className="size-4" />
                      Criar novo plano
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </section>

            <div className="flex justify-between gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">Voltar ao dashboard</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/ds">Ver Design System</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
