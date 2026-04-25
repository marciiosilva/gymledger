import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  Banknote,
  CheckCircle2,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload
} from "lucide-react";
import {
  cashflowSummary,
  expenseBreakdown,
  financeMetrics,
  receivableQueue,
  reconciliationItems,
  transactionRows
} from "../data/financeMock";
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
  { label: "Alunos", href: "/alunos", badge: 148 },
  { label: "Financeiro", href: "/financeiro", active: true, badge: 23 },
  { label: "Planos" },
  { label: "Relatorios" }
];

const periodOptions = [
  { value: "abril", label: "Abril 2026" },
  { value: "marco", label: "Marco 2026" },
  { value: "trimestre", label: "Ultimo trimestre" }
];

const accountOptions = [
  { value: "todas", label: "Todas as contas" },
  { value: "nubank", label: "Nubank PJ" },
  { value: "itau", label: "Itau" },
  { value: "stone", label: "Stone" },
  { value: "manual", label: "Manual" }
];

const typeOptions = [
  { value: "todos", label: "Entradas e saidas" },
  { value: "entrada", label: "Entradas" },
  { value: "saida", label: "Saidas" },
  { value: "pendentes", label: "Pendentes" }
];

function badgeVariant(tone: string) {
  if (tone === "success") return "success";
  if (tone === "warning") return "warning";
  return "info";
}

export function FinancePage() {
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
                Caixa, mensalidades e conciliacao com decisao rapida.
              </p>
            </div>

            <SidebarNav items={navItems} />

            <div className="rounded-[var(--radius-xl)] border border-white/12 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-sm">
              <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/65">
                Fechamento do mes
              </p>
              <p className="m-0 mt-2 text-sm leading-6 text-white/78">
                Abril esta com 82% da receita conciliada e 4 lancamentos aguardando revisao.
              </p>
            </div>
          </div>
        </aside>

        <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
          <div className="mx-auto grid max-w-[1440px] gap-6">
            <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-[780px]">
                <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-accent-active)]">
                  Financeiro
                </p>
                <h1 className="m-0 mt-3 max-w-[15ch] font-display text-[clamp(2.25rem,4vw,3.85rem)] leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)]">
                  Caixa previsivel com conciliacao e cobranca no centro.
                </h1>
                <p className="m-0 mt-4 max-w-[68ch] text-[var(--text-base)] leading-7 text-[var(--color-text-muted)]">
                  Controle entradas, saidas, mensalidades abertas e lancamentos importados sem
                  depender de gateway para enxergar a saude financeira do studio.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[560px] xl:justify-end">
                <Button variant="secondary" size="md">
                  <Upload className="size-4" />
                  Importar extrato
                </Button>
                <Button variant="secondary" size="md">
                  <Download className="size-4" />
                  Exportar fechamento
                </Button>
                <Button variant="primary" size="md">
                  <Plus className="size-4" />
                  Novo lancamento
                </Button>
              </div>
            </header>

            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Indicadores financeiros"
            >
              {financeMetrics.map((metric) => (
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

            <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="grid min-w-0 gap-4">
                <Card variant="tinted" className="min-w-0">
                  <Card.Header className="flex-col gap-5 pb-0 xl:flex-row">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Fluxo de caixa
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em]">
                        Entradas, saidas e saldo atual do mes
                      </h2>
                    </div>
                    <Badge variant="info" size="md">
                      Atualizado ha 2 min
                    </Badge>
                  </Card.Header>
                  <Card.Body className="grid gap-4 pt-5">
                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                      {cashflowSummary.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4 shadow-[var(--shadow-sm)]"
                        >
                          <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                            {item.label}
                          </p>
                          <strong className="mt-2 block font-display text-[var(--text-xl)]">
                            {item.amount}
                          </strong>
                          <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                <Card variant="elevated" className="min-w-0">
                  <Card.Header className="flex-col gap-5 pb-0 xl:flex-row">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Livro caixa
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em]">
                        Lancamentos recentes e status de conciliacao
                      </h2>
                    </div>
                  </Card.Header>

                  <Card.Body className="grid gap-5 pt-5">
                    <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-[minmax(220px,1fr)_170px_170px_170px_auto]">
                      <Input
                        aria-label="Buscar lancamento"
                        placeholder="Buscar por aluno, descricao ou categoria"
                        leadingIcon={<Search className="size-4" />}
                      />
                      <Select options={periodOptions} defaultValue="abril" />
                      <Select options={accountOptions} defaultValue="todas" />
                      <Select options={typeOptions} defaultValue="todos" />
                      <Button variant="secondary" size="md" className="justify-center">
                        <Filter className="size-4" />
                        Filtrar
                      </Button>
                    </div>

                    <Table density="compact" className="min-w-0">
                      <Table.Head>
                        <Table.Row>
                          <Table.HeaderCell>Data</Table.HeaderCell>
                          <Table.HeaderCell>Descricao</Table.HeaderCell>
                          <Table.HeaderCell>Categoria</Table.HeaderCell>
                          <Table.HeaderCell>Conta</Table.HeaderCell>
                          <Table.HeaderCell>Tipo</Table.HeaderCell>
                          <Table.HeaderCell>Valor</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                          <Table.HeaderCell className="text-right">Acoes</Table.HeaderCell>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {transactionRows.map((row) => (
                          <Table.Row key={`${row.date}-${row.description}`}>
                            <Table.Cell>{row.date}</Table.Cell>
                            <Table.Cell className="font-[700]">{row.description}</Table.Cell>
                            <Table.Cell>{row.category}</Table.Cell>
                            <Table.Cell>{row.account}</Table.Cell>
                            <Table.Cell>
                              <Badge
                                variant={row.type === "Entrada" ? "success" : "neutral"}
                                size="sm"
                              >
                                {row.type}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell className="font-[700]">{row.amount}</Table.Cell>
                            <Table.Cell>
                              <StatusBadge status={row.status} size="sm" />
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex justify-end gap-1">
                                <Tooltip content="Conciliar lancamento">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Conciliar ${row.description}`}
                                  >
                                    <CheckCircle2 className="size-4" />
                                  </Button>
                                </Tooltip>
                                <Dropdown>
                                  <Dropdown.Trigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      aria-label={`Mais acoes para ${row.description}`}
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </Dropdown.Trigger>
                                  <Dropdown.Content>
                                    <Dropdown.Label>{row.description}</Dropdown.Label>
                                    <Dropdown.Item>Editar lancamento</Dropdown.Item>
                                    <Dropdown.Item>Vincular mensalidade</Dropdown.Item>
                                    <Dropdown.Item>Duplicar</Dropdown.Item>
                                    <Dropdown.Separator />
                                    <Dropdown.Item destructive>Excluir</Dropdown.Item>
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
              </div>

              <div className="grid min-w-0 gap-4">
                <Card variant="dark">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/70">
                        Conciliacao
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.55rem] leading-[1.06] tracking-[-0.04em] text-white">
                        Fontes que precisam de decisao
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {reconciliationItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[var(--radius-lg)] border border-white/8 bg-white/6 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <strong className="font-display text-base text-white">
                            {item.title}
                          </strong>
                          <Badge variant={badgeVariant(item.tone)} size="sm">
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="m-0 mt-2 text-sm leading-6 text-white/70">
                          {item.description}
                        </p>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm">
                      <ArrowDownToLine className="size-4" />
                      Ver importacoes
                    </Button>
                  </Card.Body>
                </Card>

                <Card variant="tinted">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Contas a receber
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.45rem] leading-[1.08] tracking-[-0.04em]">
                        Mensalidades abertas prioritarias
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {receivableQueue.map((item) => (
                      <div
                        key={item.student}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <strong className="font-display text-base">{item.student}</strong>
                            <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
                              {item.plan} - vence {item.dueDate}
                            </p>
                          </div>
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-display text-lg font-[700]">{item.amount}</span>
                          <Button variant="secondary" size="sm">
                            Cobrar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                <Card variant="tinted">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Despesas
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.45rem] leading-[1.08] tracking-[-0.04em]">
                        Composicao do custo mensal
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {expenseBreakdown.map((item) => (
                      <div key={item.label} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-body text-sm font-[700]">{item.label}</span>
                          <span className="font-display text-sm font-[700]">{item.amount}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                          <div
                            className="h-full rounded-full bg-[var(--color-accent)]"
                            style={{ width: item.share }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm">
                      <Banknote className="size-4" />
                      Lancar despesa
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
