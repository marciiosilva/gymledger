# Plano — MVP GymLedger enxuto (Lean, sem gateway)

## Contexto

GymLedger já tem Design System próprio + home mockada. Próximo passo: definir **escopo mínimo viável** para validar com clientes reais. Este plano é de **produto**, não de código.

**Decisões tomadas nesta sessão:**
- Framework: **Lean Startup** (build-measure-learn, escopo mínimo para aprender).
- ICP inicial: **Studio pequeno, 1 unidade, até 150 alunos** — Crossfit, funcional, boutique. Dono faz tudo.
- Posicionamento: **Financeiro-first, UX estilo fintech** (Mercury/Stripe como inspiração visual).
- **Sem Stripe no MVP.** O cliente **importa** / **registra** as movimentações que já recebe hoje (PIX, maquininha, dinheiro) e o GymLedger organiza, concilia e dá previsibilidade. Stripe vira **upgrade opcional** no futuro para quem quiser cobrança recorrente automatizada.

**Por que sem Stripe no MVP:**
- Atinge 100% do mercado BR (muita academia recebe PIX direto, sem gateway).
- Zero atrito na decisão de compra — o dono não precisa mudar nada do que já faz.
- Monetiza GymLedger sem depender de Stripe Brasil / Stripe Connect / taxas.
- Plugar Stripe depois é incremental, não reescrita.

---

## Hipótese a validar

> "Donos de studio pequeno pagariam R$ 99-199/mês por um software que **organiza o dinheiro que já entra hoje** (PIX, maquininha, dinheiro), **concilia automaticamente** com as mensalidades dos alunos, **reduz inadimplência** com régua de cobrança e dá **previsibilidade de caixa**, substituindo a planilha do Excel."

Se vencer, provamos valor sem depender de gateway. Aí Stripe entra como upsell.

---

## Diferenciais do MVP (vs Tecnofit/Pacto/Evolux/W12/Tribo e vs Excel)

1. **Zero fricção de adoção** — não troca gateway, não pede Stripe, não pede cartão. Começa hoje.
2. **Conciliação de extrato inteligente** — upload de CSV/OFX bate automaticamente com mensalidades (matching por nome/valor/data). **Concorrentes fazem mal ou não fazem.**
3. **Livro-caixa completo** — não só receita de planos. Também **saídas** (aluguel, folha, equipamentos). Visão real de caixa, não só de MRR.
4. **UX fintech** — Design System já pronto entrega diferenciação visual imediata contra UI dos concorrentes.
5. **Régua de cobrança manual-assistida** — lista "precisa cobrar hoje" com 1 clique pra mandar WhatsApp via template.
6. **Preço fixo por academia** — não pune crescimento. Concorrentes cobram por aluno.
7. **Upgrade opcional pra Stripe depois** — cliente evolui quando quiser, sem reimportar nada.

---

## Escopo do MVP (9 módulos enxutos)

### 1. Onboarding
- Cria conta da academia (email + senha + nome do estabelecimento).
- Wizard de 3 passos: conta → primeiro plano → primeiro aluno.
- **Meta:** dono com conta operacional em < 5 min, sem ter que conectar nada externo.

### 2. Planos
- CRUD simples: nome, valor, periodicidade (mensal / trimestral / semestral / anual), dia de vencimento padrão.
- Método de cobrança principal informativo (PIX / cartão maquininha / dinheiro / link externo) — só para relatório.
- Lista mostra nº de alunos ativos por plano.

### 3. Alunos
- Cadastro mínimo: nome, email, WhatsApp, plano, data de início.
- Sistema calcula **data do primeiro vencimento** e gera a série de mensalidades.
- **Status financeiro** visível: em dia / atrasado / cancelado / pendente — controlado pelo próprio sistema com base nas mensalidades pagas vs em aberto.
- Detalhe do aluno: histórico de mensalidades, próximo vencimento, ações rápidas.

### 4. Mensalidades (contas a receber)
- Geração automática mês a mês com base na data de início do aluno + periodicidade do plano.
- Dono marca como **"Recebido"** manualmente (data + método: PIX / maquininha / dinheiro / outro).
- Edição em lote (ex.: marcar 10 mensalidades como pagas hoje).
- Cancelamento (aluno deu baixa, mensalidade vira "cancelada").

### 5. Importação de extrato (diferencial)
- Upload **CSV** (padrão bancário brasileiro) e **OFX**.
- Parser identifica data, valor, descrição.
- **Matching automático** com mensalidades em aberto por:
  - Valor exato.
  - Nome do aluno na descrição (quando houver).
  - Data próxima do vencimento.
- Tela de **conciliação** para os que não casaram: dono arrasta lançamento → aluno/mensalidade em 1 clique.
- Lançamentos não vinculados a aluno podem virar **entrada avulsa** (ex.: venda de suplemento) ou **saída** (despesa).

### 6. Fluxo de caixa (entradas e saídas)
- Registro manual ou vindo do extrato.
- Categorias simples: receita de plano / receita avulsa / folha / aluguel / equipamentos / impostos / outros.
- Visão por mês: total de entradas, total de saídas, saldo.
- Gráfico de evolução mensal (últimos 6 meses).

### 7. Dashboard financeiro (hero — reutiliza Design System)
Reutilizar `MetricCard`, `PaymentRow`, `Table` do DS. Hero cards:
- **MRR previsto** (soma dos planos ativos no mês).
- **Recebido no mês** (real, após conciliação).
- **A receber no mês** (mensalidades em aberto no período).
- **Inadimplência** (mensalidades vencidas há > 5 dias, R$ e %).
- **Saldo de caixa** (entradas – saídas do mês).
- **Top 5 atrasados** (clicável).
- **Fluxo de caixa semanal** (7 dias, reusa `cashflow-strip`).

### 8. Régua de cobrança manual-assistida
- Tela "precisa cobrar hoje": lista com filtros D-3, D+0, D+3, D+7.
- **Templates editáveis** por etapa (D-3: lembrete, D+3: atraso, D+7: aviso de risco).
- Ações por linha:
  - Abrir WhatsApp do aluno com mensagem pronta (wa.me link).
  - Copiar mensagem para área de transferência.
  - Marcar "cobrado hoje" (log histórico).
- **Sem envio automático no MVP** (evita barreira de infra de WhatsApp/email); o dono aciona manualmente.

### 9. Relatório mensal / Fechamento
- Visão consolidada do mês: recebido, em aberto, inadimplência, saídas, saldo.
- **Export CSV e PDF** (entregável para contador).
- Histórico mensal (últimos 12 meses).

---

## Fora do MVP (validar antes de construir)

- **Stripe / gateway nativo** — fica para v2 como upgrade opcional (migração sem perda de histórico).
- **PIX dinâmico gerado pelo sistema** — v2.
- **IA de treino** — v2+. Só faz sentido depois que o cliente ficou pelo financeiro.
- **Check-in / QR Code** — operacional, não resolve a dor central.
- **App mobile do aluno** — web responsivo serve.
- **Gestão de professores / atribuição de treinos** — v2+.
- **Multi-unidade** — ICP inicial é 1 unidade.
- **Bloqueio automático por inadimplência** — depende de check-in.
- **Envio automático de WhatsApp/email pela régua** — depende de integração paga (Twilio/WhatsApp Business API). No MVP o dono aciona.
- **Relatórios / BI avançado**.

---

## Métricas do ciclo Lean (build-measure-learn)

**Leading (ativação):**
- % de setups concluídos em < 5 min.
- % de academias que cadastram ≥ 10 alunos na primeira semana.
- % que fazem a primeira importação de extrato no primeiro mês.

**Learning (valor percebido):**
- Inadimplência antes vs depois (self-report + medição após 60 dias).
- Horas/semana que o dono gastava no controle financeiro antes vs depois.
- NPS + entrevista qualitativa a cada 30 dias.
- % de mensalidades pagas via matching automático vs conciliação manual.

**Lagging (negócio):**
- MRR do GymLedger.
- Churn mensal.
- Activation rate (% de cadastros que chegam a fazer conciliação de 1 extrato).
- LTV / CAC pós-beta.

---

## Sequência de entrega sugerida (5 sprints, ~10 semanas com 1 dev)

| Sprint | Entregas |
|---|---|
| **1** — Fundação | Backend: schema multi-tenant, auth JWT, entidades Gym/User/Plan/Student/Mensalidade. Frontend: onboarding wizard (3 passos). Infra: staging + Postgres. |
| **2** — Alunos & Mensalidades | CRUD de Planos. CRUD de Alunos com geração automática da série de mensalidades. Marcar mensalidade como paga (manual). Status financeiro do aluno calculado pelo sistema. |
| **3** — Dashboard & Caixa | Dashboard financeiro (MRR, recebido, a receber, inadimplência, saldo). Módulo de entradas/saídas manuais com categorias. Relatório mensal com export CSV/PDF. |
| **4** — Importação & Conciliação (diferencial) | Parser CSV/OFX. Matching automático (valor + nome + data). Tela de conciliação para não-matches. Fluxo de aceitar/rejeitar/reclassificar. |
| **5** — Régua & Piloto | Régua manual-assistida com templates WhatsApp/email + link wa.me. Polish, telemetria, Sentry. Onboarding de **3 academias piloto**. |

---

## Plano de piloto (validação com clientes reais)

- **3 academias beta** (ICP: studio 1 unidade, até 150 alunos).
- Período: 90 dias gratuitos ou preço simbólico (R$ 49/mês).
- **Onboarding assistido pelo fundador** — cada atrito vira backlog.
- Entrevista quinzenal de 30 min + telemetria de uso.
- **Go/No-go para v2 (inclusive Stripe):** se ≥ 2 das 3 academias renovarem pagando preço cheio após 90 dias **e** inadimplência cair ≥ 20% self-reported, hipótese validada.

---

## Arquivos críticos do projeto (referência)

- [projetogymledger.md](../projetogymledger.md) — spec de produto. **Vai precisar de atualização** para refletir a decisão "sem Stripe no MVP" (hoje o doc diz Stripe obrigatório).
- `src/App.tsx` — home mockada já migrada para o DS. Shape do dashboard hero.
- `src/data/homepageMock.js` — mock de dados. Contrato inicial da API.
- `src/design-system/` — componentes prontos (MetricCard, PaymentRow, SidebarNav, StatusBadge, Button, Table). **Reutilizar no MVP.**

---

## Decisões abertas (precisam de escolha antes do sprint 1)

1. **Stack backend** — Node/Express, NestJS, Hono, ou Fastify? (Spec não define.)
2. **ORM** — Prisma (ótima DX + tipagem) vs Drizzle (leve, mais SQL-like).
3. **Hospedagem** — Supabase (auth + Postgres + storage em 1) vs Railway/Fly + Neon/Postgres próprio.
4. **Formato de CSV suportado** — padronizar inicialmente em Itaú/Nubank/Inter/BB (extrato consumer) ou já aceitar OFX?
5. **Multi-tenancy concreto** — schema por academia (decisão do spec original) ou tenant_id em cada tabela? Schema-per-tenant é mais caro em Postgres gerenciado.
6. **Monetização do beta** — 100% grátis nos primeiros 90 dias ou R$ 49 simbólico? Pago simbólico filtra curiosos.

---

## Upgrade para Stripe (v2 — depois da validação)

Quando a hipótese for validada, plugar Stripe é incremental:
- Nova entidade opcional: `PaymentProvider` por academia.
- Planos ganham flag "cobrança automatizada".
- Alunos com cobrança automatizada passam a ter `Stripe.Customer` + `Subscription`.
- Webhooks Stripe marcam mensalidades como pagas automaticamente (mesma tabela que hoje é alimentada pela importação).
- **Todo o resto (dashboard, régua, relatórios, caixa) continua funcionando igual** — só troca o motor de entrada de dados.

Isso é a prova de que a arquitetura do MVP está certa: o gateway é um **detalhe de implementação da fonte de entradas**, não a espinha dorsal do produto.

---

## Critério de pronto (DoD do MVP)

- [ ] 9 módulos entregues e testados (unit tests para regras de negócio, E2E para onboarding → cadastro → conciliação → dashboard).
- [ ] Onboarding completo em < 5 min validado com 3 usuários reais.
- [ ] Importação de extrato real (Itaú, Nubank, Inter, BB) concilia ≥ 70% automaticamente no dataset do piloto.
- [ ] Dashboard mostra MRR, recebido, inadimplência e saldo com dados reais.
- [ ] Régua tem templates editáveis + link WhatsApp funcional.
- [ ] 3 academias piloto rodando com dados reais por 30 dias sem intervenção diária do time.
- [ ] Relatório mensal exportado em CSV e PDF.
- [ ] Logs estruturados + Sentry ativo.
- [ ] Atualizar [projetogymledger.md](../projetogymledger.md) para refletir "sem Stripe no MVP, upgrade opcional".
