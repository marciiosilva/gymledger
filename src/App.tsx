import { Link } from "react-router-dom";
import {
  cadenceItems,
  dueSoon,
  moduleCards,
  navItems,
  overdueRows,
  quickActions,
  recentPayments,
  reconciliationQueue,
  topMetrics,
  weeklyCashflow
} from "./data/homepageMock";
import { MetricCard } from "./design-system/patterns/MetricCard/MetricCard";
import { PaymentRow } from "./design-system/patterns/PaymentRow/PaymentRow";
import { SidebarNav } from "./design-system/patterns/SidebarNav/SidebarNav";
import { Badge } from "./design-system/primitives/Badge/Badge";
import { Button } from "./design-system/primitives/Button/Button";
import { Card } from "./design-system/primitives/Card/Card";
import { StatusBadge } from "./design-system/primitives/StatusBadge/StatusBadge";
import { Table } from "./design-system/primitives/Table/Table";

function App() {
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
                MVP lean ativo. Sem gateway obrigatorio, com caixa e conciliacao no centro.
              </p>
            </div>

            <SidebarNav items={navItems} />

            <div className="rounded-[var(--radius-xl)] border border-white/12 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-sm">
              <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/65">
                Hipotese em validacao
              </p>
              <p className="m-0 mt-2 text-sm leading-6 text-white/78">
                Substituir a planilha por previsibilidade financeira, conciliacao simples e cobranca assistida.
              </p>
            </div>
          </div>
        </aside>

        <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
          <div className="mx-auto grid max-w-[1440px] gap-6">
            <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-[760px]">
                <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-accent-active)]">
                  MVP lean • financeiro-first
                </p>
                <h1 className="m-0 mt-3 max-w-[14ch] font-display text-[clamp(2.3rem,4vw,4rem)] leading-[0.96] tracking-[-0.04em] text-[var(--color-text-primary)]">
                  Luis, seu studio esta operando com caixa previsivel e sem planilha.
                </h1>
                <p className="m-0 mt-4 max-w-[64ch] text-[var(--text-base)] leading-7 text-[var(--color-text-muted)]">
                  Esta home foi reposicionada para o MVP real: organizar o dinheiro que ja entra
                  hoje, conciliar extratos, acompanhar mensalidades e reduzir inadimplencia com
                  uma regua manual-assistida.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[520px] xl:justify-end">
                {quickActions.map((action, index) => (
                  <Button key={action} variant={index === 0 ? "primary" : "secondary"} size="md">
                    {action}
                  </Button>
                ))}
              </div>
            </header>

            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
              aria-label="Indicadores principais do MVP"
            >
              {topMetrics.map((metric) => (
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
              <Card variant="tinted">
                <Card.Header className="pb-0">
                  <div>
                    <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      Dashboard financeiro
                    </p>
                    <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em]">
                      Receita prevista, caixa e conciliacao sem depender de Stripe
                    </h2>
                  </div>
                  <Badge variant="info" size="md">
                    Atualizado ha 2 min
                  </Badge>
                </Card.Header>
                <Card.Body className="grid gap-5 pt-5">
                  <div className="grid gap-3 md:grid-cols-5">
                    {weeklyCashflow.map((entry) => (
                      <div
                        key={entry.day}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4 shadow-[var(--shadow-sm)]"
                      >
                        <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                          {entry.day}
                        </p>
                        <strong className="mt-2 block font-display text-[var(--text-xl)]">
                          {entry.amount}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white/92 p-5 shadow-[var(--shadow-sm)]">
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        O que valida o MVP
                      </p>
                      <ul className="m-0 mt-3 grid gap-3 p-0 text-sm leading-6 text-[var(--color-text-muted)]">
                        <li className="list-none">Upload de CSV ou OFX com conciliacao semiautomatica.</li>
                        <li className="list-none">Livro-caixa com entradas, saidas e saldo real do mes.</li>
                        <li className="list-none">Mensalidades previsiveis por plano e status financeiro por aluno.</li>
                      </ul>
                    </div>

                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white/92 p-5 shadow-[var(--shadow-sm)]">
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Aprendizado da semana
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="success">10 matches automaticos</Badge>
                        <Badge variant="warning">4 conciliacoes manuais</Badge>
                        <Badge variant="neutral">3 exportacoes de fechamento</Badge>
                      </div>
                      <p className="m-0 mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
                        A home agora evidencia o ciclo build-measure-learn do MVP, em vez de vender
                        modulos que o plano colocou para depois.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card variant="dark" className="relative">
                <Card.Header className="pb-0">
                  <div>
                    <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/70">
                      Regua manual-assistida
                    </p>
                    <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-white">
                      Precisa cobrar hoje
                    </h2>
                  </div>
                </Card.Header>
                <Card.Body className="grid gap-3 pt-5">
                  {cadenceItems.map((item) => (
                    <div
                      key={item.window}
                      className="rounded-[var(--radius-lg)] border border-white/8 bg-white/6 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-white/60">
                            {item.window}
                          </p>
                          <strong className="mt-2 block font-display text-lg text-white">
                            {item.title}
                          </strong>
                        </div>
                        <Badge variant="success" size="sm">
                          {item.count}
                        </Badge>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-4 w-full">
                        {item.action}
                      </Button>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Modulos MVP">
              {moduleCards.map((module) => (
                <Card key={module.title} variant="tinted">
                  <Card.Body className="grid gap-3">
                    <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      {module.title}
                    </p>
                    <strong className="font-display text-[1.5rem] leading-tight text-[var(--color-text-primary)]">
                      {module.stat}
                    </strong>
                    <p className="m-0 text-sm leading-6 text-[var(--color-text-muted)]">
                      {module.description}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_380px]">
              <div className="grid gap-4">
                <Card variant="elevated">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Top 5 atrasados
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.6rem] leading-[1.05] tracking-[-0.04em]">
                        Mensalidades vencidas que pedem acao imediata
                      </h2>
                    </div>
                    <Badge variant="warning" size="md">
                      {overdueRows.length} casos prioritarios
                    </Badge>
                  </Card.Header>
                  <Card.Body className="pt-5">
                    <Table density="compact">
                      <Table.Head>
                        <tr>
                          <Table.HeaderCell>Aluno</Table.HeaderCell>
                          <Table.HeaderCell>Plano</Table.HeaderCell>
                          <Table.HeaderCell>Vencimento</Table.HeaderCell>
                          <Table.HeaderCell>Valor</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                        </tr>
                      </Table.Head>
                      <Table.Body>
                        {overdueRows.map((row) => (
                          <Table.Row key={`${row.student}-${row.dueDate}`}>
                            <Table.Cell className="font-[700]">{row.student}</Table.Cell>
                            <Table.Cell>{row.plan}</Table.Cell>
                            <Table.Cell>{row.dueDate}</Table.Cell>
                            <Table.Cell className="font-[700]">{row.amount}</Table.Cell>
                            <Table.Cell>
                              <StatusBadge status={row.status} size="sm" />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Card.Body>
                </Card>

                <Card variant="elevated">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Recebimentos conciliados
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.6rem] leading-[1.05] tracking-[-0.04em]">
                        Ultimos recebimentos reconhecidos pelo sistema
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {recentPayments.map((row) => (
                      <PaymentRow key={`${row.student}-${row.date}`} {...row} />
                    ))}
                  </Card.Body>
                </Card>
              </div>

              <div className="grid gap-4">
                <Card variant="tinted">
                  <Card.Header className="pb-0">
                    <div>
                      <p className="m-0 text-[11px] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Conciliacao pendente
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.4rem] leading-[1.08] tracking-[-0.04em]">
                        O que ainda precisa de decisao manual
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {reconciliationQueue.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <strong className="font-display text-base">{item.title}</strong>
                          <Badge variant="info" size="sm">
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
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
                        Proximos vencimentos
                      </p>
                      <h2 className="m-0 mt-2 font-display text-[1.4rem] leading-[1.08] tracking-[-0.04em]">
                        Quem entra na regua nos proximos dias
                      </h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="grid gap-3 pt-5">
                    {dueSoon.map((item) => (
                      <div
                        key={item.student}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/90 p-4"
                      >
                        <strong className="font-display text-base">{item.student}</strong>
                        <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">{item.plan}</p>
                        <Badge variant="neutral" size="sm" className="mt-3">
                          {item.dueIn}
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </div>
            </section>

            <div className="flex justify-end">
              <Button asChild variant="ghost" size="sm">
                <Link to="/ds">Ver Design System →</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
