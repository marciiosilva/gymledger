import { Link } from "react-router-dom";
import {
  alertCards,
  cashflow,
  coachBoard,
  moduleCards,
  navItems,
  paymentRows,
  quickActions,
  studentsSnapshot,
  topMetrics,
} from "./data/homepageMock";
import { Button } from "./design-system/primitives/Button/Button";
import { MetricCard } from "./design-system/patterns/MetricCard/MetricCard";
import { PaymentRow } from "./design-system/patterns/PaymentRow/PaymentRow";
import { SidebarNav } from "./design-system/patterns/SidebarNav/SidebarNav";

const navData = navItems.map((label: string, index: number) => ({
  label,
  active: index === 0,
}));

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-bar brand-bar-one" />
            <span className="brand-bar brand-bar-two" />
            <span className="brand-bar brand-bar-three" />
            <span className="brand-trend" />
          </div>
          <div>
            <p className="brand-name">GymLedger</p>
            <p className="brand-tag">Controle financeiro. Performance real.</p>
          </div>
        </div>

        <div className="gym-summary">
          <span className="summary-label">Conta principal</span>
          <strong>Nova Era Fitness</strong>
          <span className="summary-meta">2 unidades ativas • Stripe conectado</span>
        </div>

        <SidebarNav items={navData} />

        <div className="sidebar-card">
          <span className="summary-label">Atalho rapido</span>
          <strong>Gerar treino com IA</strong>
          <p>Use objetivo, nivel e frequencia para criar um rascunho editavel.</p>
        </div>
      </aside>

      <main className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard do gestor</p>
            <h1>
              Boa tarde, Luis. Sua academia esta operando com{" "}
              <span className="accent-text">previsibilidade.</span>
            </h1>
            <p className="header-copy">
              Acompanhe receita, cobrancas, alunos e execucao da equipe a partir
              da tela principal do produto.
            </p>
          </div>

          <div className="header-actions">
            {quickActions.map((action: string, index: number) => (
              <Button
                key={action}
                variant={index === 0 ? "primary" : "secondary"}
                size="md"
              >
                {action}
              </Button>
            ))}
          </div>
        </header>

        <section className="metrics-grid" aria-label="Indicadores principais">
          {topMetrics.map(
            (metric: { title: string; value: string; delta: string; tone: string }) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                delta={metric.delta}
                variant={metric.tone as "emerald" | "blue" | "amber" | "slate"}
                trend={metric.tone === "amber" ? "down" : "up"}
              />
            )
          )}
        </section>

        <section className="hero-grid">
          <article className="focus-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Resumo financeiro</p>
                <h2>Receita prevista vs recebida, sem sair da home</h2>
              </div>
              <span className="status-pill">Atualizado ha 2 min</span>
            </div>

            <div className="cashflow-strip" aria-label="Fluxo de caixa semanal">
              {cashflow.map((entry: { day: string; amount: string }) => (
                <div className="cashflow-card" key={entry.day}>
                  <span>{entry.day}</span>
                  <strong>{entry.amount}</strong>
                </div>
              ))}
            </div>

            <div className="alert-stack">
              {alertCards.map(
                (alert: { title: string; description: string; action: string }) => (
                  <article className="alert-card" key={alert.title}>
                    <div>
                      <h3>{alert.title}</h3>
                      <p>{alert.description}</p>
                    </div>
                    <Button variant="primary" size="sm">{alert.action}</Button>
                  </article>
                )
              )}
            </div>
          </article>

          <article className="operations-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Central operacional</p>
                <h2>O que precisa da sua atencao agora</h2>
              </div>
            </div>

            <div className="operations-list">
              <div className="operation-item">
                <span className="operation-label">Receita em risco</span>
                <strong>R$ 6.320</strong>
                <p>Pagamentos em atraso ou com retentativa pendente.</p>
              </div>
              <div className="operation-item">
                <span className="operation-label">Treinos na fila</span>
                <strong>6</strong>
                <p>Sugestoes da IA aguardando revisao dos professores.</p>
              </div>
              <div className="operation-item">
                <span className="operation-label">Check-ins bloqueados</span>
                <strong>4</strong>
                <p>Bloqueio configuravel ativo por inadimplencia.</p>
              </div>
            </div>
            <div className="operations-footer">
              <span className="operations-signal">Gym em azul. Ledger em verde.</span>
              <span className="operations-signal">Financeiro lidera a leitura da tela.</span>
            </div>
          </article>
        </section>

        <section className="modules-grid" aria-label="Modulos principais">
          {moduleCards.map(
            (module: { title: string; stat: string; description: string }) => (
              <article className="module-card" key={module.title}>
                <span className="module-title">{module.title}</span>
                <strong>{module.stat}</strong>
                <p>{module.description}</p>
              </article>
            )
          )}
        </section>

        <section className="content-grid">
          <article className="table-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Pagamentos</p>
                <h2>Cobrancas recentes</h2>
              </div>
              <span className="status-pill muted">Stripe online</span>
            </div>

            <div className="payments-table">
              <div className="payments-head" role="row">
                <span role="columnheader">Aluno</span>
                <span role="columnheader">Plano</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Valor</span>
                <span role="columnheader">Data</span>
              </div>
              {paymentRows.map(
                (row: {
                  student: string;
                  plan: string;
                  status: string;
                  amount: string;
                  date: string;
                }) => (
                  <PaymentRow key={`${row.student}-${row.date}`} {...row} />
                )
              )}
            </div>
          </article>

          <div className="right-rail">
            <article className="side-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Alunos</p>
                  <h2>Status operacional</h2>
                </div>
              </div>

              <div className="stack-list">
                {studentsSnapshot.map(
                  (student: {
                    name: string;
                    plan: string;
                    financeStatus: string;
                    workoutStatus: string;
                  }) => (
                    <div className="list-card" key={student.name}>
                      <strong>{student.name}</strong>
                      <span>{student.plan}</span>
                      <p>{student.financeStatus}</p>
                      <small>{student.workoutStatus}</small>
                    </div>
                  )
                )}
              </div>
            </article>

            <article className="side-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Equipe</p>
                  <h2>Professores e pendencias</h2>
                </div>
              </div>

              <div className="stack-list">
                {coachBoard.map(
                  (coach: { name: string; focus: string; pending: string }) => (
                    <div className="list-card" key={coach.name}>
                      <strong>{coach.name}</strong>
                      <span>{coach.focus}</span>
                      <small>{coach.pending}</small>
                    </div>
                  )
                )}
              </div>
            </article>
          </div>
        </section>

        <div className="mt-4 flex justify-end">
          <Link to="/ds">
            <Button variant="ghost" size="sm">
              Ver Design System →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default App;
