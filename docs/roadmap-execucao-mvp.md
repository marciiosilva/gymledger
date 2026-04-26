# Roadmap de Execucao - GymLedger MVP

Este roadmap traduz o PRD em uma sequencia de trabalho implementavel. A ordem prioriza entregar valor visivel cedo, reduzir risco nas regras financeiras e deixar importacao CSV/XLSX como acelerador de onboarding.

Referencia principal: [PRD - GymLedger MVP](./prd-gymledger-mvp.md)

## Principios de Execucao

- Construir primeiro o fluxo principal: plano -> aluno -> mensalidade -> pagamento -> dashboard.
- Manter financeiro sem Stripe no MVP.
- Cada fase deve terminar com algo navegavel e testavel.
- Importacao deve sempre ter preview, validacao e confirmacao.
- Regras financeiras devem ficar em funcoes/servicos testaveis, nao presas em componentes de tela.
- IA de treinos entra depois do CRUD e da estrutura editavel estarem estaveis.

## Decisoes Tecnicas Base

- Frontend: React.
- Backend: Node.js.
- Banco de dados: Supabase Postgres.
- Auth: Supabase Auth.
- ORM: Prisma.
- Multi-tenant recomendado para o MVP: `gymId` em todas as entidades de negocio, com escopo obrigatorio nas queries e preparacao para RLS no Supabase.
- Storage futuro: Supabase Storage para fotos de exercicios, videos curtos ou arquivos importados, quando necessario.

### Por que Prisma

- Boa produtividade para CRUDs do MVP.
- Schema claro e versionavel.
- Tipagem forte no ecossistema TypeScript/Node.js.
- Migrations simples para evoluir entidades como `Student`, `Plan`, `Payment`, `Workout` e `Exercise`.
- Facilita testes de regras de negocio com uma camada de acesso a dados previsivel.

Cuidados:

- Usar connection string direta do Supabase para migrations.
- Usar connection pooling adequado em runtime.
- Manter regras criticas de tenant sempre exigindo `gymId`.
- Nao depender apenas do ORM para seguranca multi-tenant; preparar RLS no Supabase quando houver acesso direto ao banco via cliente.

### Por que Supabase Auth

- Reduz escopo de autenticacao no MVP.
- Entrega login, recuperacao de senha e gestao de sessao sem construir tudo do zero.
- Integra naturalmente com Supabase Postgres.
- Permite usar JWT com `userId`, role e academia ativa.

Modelo inicial de roles:

- `admin`: acesso completo a alunos, financeiro, planos, treinos, exercicios e importacoes.
- `professor`: acesso a alunos, treinos e exercicios; sem permissoes financeiras completas.
- `aluno`: acesso futuro e limitado ao proprio treino/status.

## Marco 0 - Preparacao Tecnica

Objetivo: deixar a base pronta para implementar com consistencia.

Tarefas:

- [x] Configurar backend Node.js.
- [x] Preparar configuracao Supabase Postgres no repo.
- [x] Criar projeto Supabase e preencher credenciais locais.
- [x] Preparar schema e scripts do Prisma.
- [x] Preencher credenciais Supabase em `.env.local`.
- [x] Validar Prisma contra Supabase.
- [x] Rodar primeira migration no Supabase.
- [x] Configurar Supabase Auth.
- [x] Definir variaveis de ambiente:
  - `DATABASE_URL`.
  - `DIRECT_URL`.
  - `SUPABASE_URL`.
  - `SUPABASE_ANON_KEY`.
  - `SUPABASE_SERVICE_ROLE_KEY`.
  - `JWT_SECRET` se houver validacao propria no backend.
- [x] Adotar multi-tenant por `gymId` nas entidades de negocio.
- [x] Definir estrategia futura de RLS no Supabase.
- [x] Definir padrao de nomes das entidades e status.
- [x] Definir estrutura de pastas para dominio, componentes, paginas, dados e testes.
- [x] Criar contrato inicial de tipos/interfaces:
  - `Gym`.
  - `User`.
  - `Student`.
  - `Plan`.
  - `Payment`.
  - `Workout`.
  - `WorkoutDay`.
  - `Exercise`.
  - `WorkoutAssignment`.
  - `CheckIn`.
  - `ImportBatch`.
  - `ImportError`.
- [x] Criar seeds/mocks coerentes para todos os modulos.

Entregavel:

- Backend Node.js conectado ao Supabase.
- Prisma configurado com migrations iniciais.
- Supabase Auth configurado para login/admin inicial.
- Base de dados mockada ou persistida pronta para alimentar telas.
- Tipos e contratos minimos definidos.

Criterio para avancar:

- App compila.
- Backend sobe localmente.
- Prisma consegue rodar migration e seed.
- Usuario admin consegue autenticar.
- Dados de exemplo permitem simular o fluxo completo do MVP.

## Marco 1 - Shell, Rotas e Navegacao

Objetivo: criar a casca do produto e permitir navegar por todos os modulos.

Tarefas:

- [x] Criar/organizar rotas:
  - `/`
  - `/alunos`
  - `/alunos/:id`
  - `/financeiro`
  - `/planos`
  - `/treinos`
  - `/treinos/:id`
  - `/exercicios`
  - `/importacoes`
- [x] Revisar sidebar/topbar com itens do MVP.
- [x] Criar padrao de pagina com titulo, subtitulo, acoes e filtros.
- [x] Criar estados padronizados:
  - loading.
  - vazio.
  - erro.
  - sem resultados.
- [x] Garantir responsividade basica em desktop e mobile.

Entregavel:

- Produto navegavel com paginas ainda simples ou mockadas.

Criterio para avancar:

- Usuario consegue acessar todos os modulos principais pelo menu.
- Layout nao quebra em mobile.

## Marco 2 - Planos

Objetivo: criar a base para mensalidades e status financeiro.

Tarefas:

- [ ] [Luis] Criar lista de planos.
- [ ] [Luis] Criar formulario de plano.
- [ ] [Luis] Implementar criar, editar, ativar/inativar plano.
- [ ] [Luis] Validar valor maior que zero.
- [ ] [Luis] Validar periodicidade:
  - mensal.
  - trimestral.
  - semestral.
  - anual.
- [ ] [Luis] Exibir quantidade de alunos vinculados por plano.
- [ ] [Luis] Criar testes de validacao de plano.

Entregavel:

- CRUD de planos funcional.

Criterio para avancar:

- Um plano ativo pode ser selecionado no cadastro de aluno.

## Marco 3 - Alunos

Objetivo: permitir cadastrar e consultar a base de alunos.

Tarefas:

- [ ] [Luis] Criar lista de alunos.
- [ ] [Luis] Criar filtros por nome, status operacional, status financeiro, plano e sem treino.
- [ ] [Luis] Criar formulario de aluno.
- [ ] [Luis] Implementar criar e editar aluno.
- [ ] [Luis] Associar aluno a plano ativo.
- [ ] [Luis] Validar email/documento unico dentro da academia.
- [ ] [Luis] Criar detalhe do aluno com abas ou secoes:
  - cadastro.
  - financeiro.
  - treinos.
  - check-ins.
- [ ] [Luis] Criar deeplinks para financeiro e treinos do aluno.
- [ ] [Luis] Criar testes de validacao de aluno.

Entregavel:

- Gestao manual de alunos completa para o MVP.

Criterio para avancar:

- Usuario consegue criar aluno, associar plano e abrir detalhe do aluno.

## Marco 4 - Financeiro Manual

Objetivo: implementar o core do GymLedger sem gateway.

Tarefas:

- [ ] [Luis] Criar regra de geracao de mensalidades a partir de plano e data de inicio.
- [ ] [Luis] Criar lista de mensalidades/pagamentos.
- [ ] [Luis] Criar filtros por status, periodo, plano, aluno e tipo de pagamento.
- [ ] [Luis] Implementar registro manual de pagamento:
  - valor.
  - data de pagamento.
  - tipo de pagamento.
  - observacao.
- [ ] [Luis] Implementar edicao de pagamento.
- [ ] [Luis] Implementar cancelamento de mensalidade.
- [ ] [Luis] Criar regra de status:
  - pendente.
  - pago.
  - atrasado.
  - cancelado.
- [ ] [Luis] Calcular status financeiro do aluno.
- [ ] [Luis] Criar historico financeiro no detalhe do aluno.
- [ ] [Luis] Criar testes unitarios para:
  - mensalidade atrasada.
  - aluno inadimplente.
  - receita recebida.
  - receita prevista.
  - valor a receber.

Entregavel:

- Financeiro manual funcional e testado.

Criterio para avancar:

- Ao registrar pagamento, status do pagamento e do aluno atualizam corretamente.

## Marco 5 - Dashboard Operacional

Objetivo: transformar dados em acao diaria para o gestor.

Tarefas:

- [ ] [Luis] Criar agregadores para indicadores da Home.
- [ ] [Luis] Implementar cards:
  - check-ins de hoje.
  - alunos ativos.
  - alunos inadimplentes.
  - receita recebida no mes.
  - receita prevista no mes.
  - valor a receber.
  - treinos ativos.
- [ ] [Luis] Implementar listas acionaveis:
  - top inadimplentes.
  - vencimentos proximos.
  - alunos sem treino ativo.
- [ ] [Luis] Criar deeplink para cadastro de novo aluno.
- [ ] [Luis] Criar deeplink para importar alunos.
- [ ] [Luis] Criar deeplink para financeiro filtrado.
- [ ] [Luis] Criar deeplink para detalhe do aluno.
- [ ] [Luis] Validar numeros da Home contra o financeiro.

Entregavel:

- Home com insights reais e acoes rapidas.

Criterio para avancar:

- Mudancas em alunos/pagamentos refletem nos cards da Home.

## Marco 6 - Importacao de Alunos CSV/XLSX

Objetivo: acelerar onboarding de academias com base existente.

Tarefas:

- [ ] [Marcio] Definir modelo de planilha de alunos.
- [ ] [Marcio] Criar botao para baixar modelo.
- [ ] [Marcio] Implementar upload CSV.
- [ ] [Marcio] Implementar upload XLSX.
- [ ] [Marcio] Criar preview da importacao.
- [ ] [Marcio] Implementar mapeamento de colunas.
- [ ] [Marcio] Validar campos obrigatorios.
- [ ] [Marcio] Validar duplicidade por email/documento.
- [ ] [Marcio] Exibir erro por linha e campo.
- [ ] [Marcio] Confirmar importacao.
- [ ] [Marcio] Registrar `ImportBatch`.
- [ ] [Marcio] Registrar `ImportError`.
- [ ] [Marcio] Criar testes de importacao.

Entregavel:

- Importacao de alunos pronta para uso real.

Criterio para avancar:

- Uma planilha valida importa alunos sem quebrar planos/status.
- Uma planilha invalida mostra erros claros antes de gravar.

## Marco 7 - Exercicios

Objetivo: criar biblioteca de exercicios reutilizavel nos treinos.

Tarefas:

- [ ] [Marcio] Criar lista de exercicios.
- [ ] [Marcio] Criar filtros por nome e grupo muscular.
- [ ] [Marcio] Criar formulario de exercicio.
- [ ] [Marcio] Implementar criar, editar e inativar exercicio.
- [ ] [Marcio] Suportar imagem por URL.
- [ ] [Marcio] Suportar video por URL.
- [ ] [Marcio] Criar modelo de planilha de exercicios.
- [ ] [Marcio] Implementar importacao CSV/XLSX de exercicios.
- [ ] [Marcio] Validar duplicidade por nome/grupo muscular quando fizer sentido.
- [ ] [Marcio] Criar testes de importacao de exercicios.

Entregavel:

- Biblioteca de exercicios manual e importavel.

Criterio para avancar:

- Exercicios cadastrados/importados aparecem na montagem de treino.

## Marco 8 - Treinos

Objetivo: criar treinos editaveis e associaveis a alunos.

Tarefas:

- [ ] [Marcio] Criar lista de treinos.
- [ ] [Marcio] Criar formulario de treino.
- [ ] [Marcio] Criar estrutura de dias:
  - A.
  - B.
  - C.
  - outros.
- [ ] [Marcio] Permitir adicionar exercicios ao dia de treino.
- [ ] [Marcio] Definir campos por exercicio no treino:
  - series.
  - repeticoes.
  - carga sugerida.
  - descanso.
  - observacoes.
- [ ] [Marcio] Associar treino ao aluno.
- [ ] [Marcio] Duplicar treino.
- [ ] [Marcio] Inativar treino.
- [ ] [Marcio] Exibir treinos no detalhe do aluno.
- [ ] [Marcio] Criar modelo de planilha de treinos.
- [ ] [Marcio] Implementar importacao CSV/XLSX de treinos.
- [ ] [Marcio] Criar testes para montagem e associacao de treino.

Entregavel:

- CRUD de treinos completo para o MVP.

Criterio para avancar:

- Usuario consegue criar treino, adicionar exercicios e vincular a um aluno.

## Marco 9 - Check-in Simples

Objetivo: alimentar a Home e o historico do aluno com frequencia basica.

Tarefas:

- [ ] [Luis] Criar acao de registrar check-in manual.
- [ ] [Luis] Evitar duplicidade acidental no mesmo dia, se definido pela regra.
- [ ] [Luis] Exibir historico de check-ins no detalhe do aluno.
- [ ] [Luis] Atualizar card de check-ins de hoje na Home.
- [ ] [Luis] Criar filtro/lista simples de check-ins se necessario.

Entregavel:

- Check-in manual funcional.

Criterio para avancar:

- Check-in registrado aparece na Home e no detalhe do aluno.

## Marco 10 - IA de Treinos

Objetivo: adicionar geracao assistida sem comprometer controle do professor.

Tarefas:

- [ ] [Marcio] Definir modelo de prompt.
- [ ] [Marcio] Criar formulario de geracao:
  - aluno.
  - objetivo.
  - nivel.
  - frequencia.
  - restricoes.
- [ ] [Marcio] Chamar LLM com chave configurada por ambiente.
- [ ] [Marcio] Transformar resposta em estrutura de treino editavel.
- [ ] [Marcio] Validar resposta antes de salvar.
- [ ] [Marcio] Permitir editar antes de associar ao aluno.
- [ ] [Marcio] Criar fallback para erro da IA.
- [ ] [Marcio] Criar testes para parser/normalizador da resposta.

Entregavel:

- Geracao de treino assistida por IA, sempre editavel.

Criterio para avancar:

- Professor consegue gerar, revisar, editar e salvar treino para um aluno.

## Marco 11 - Qualidade e Piloto

Objetivo: preparar MVP para uso com academias reais.

Tarefas:

- [ ] [Ambos] Revisar responsividade das telas principais.
- [ ] [Ambos] Revisar acessibilidade basica.
- [ ] [Luis] Cobrir regras financeiras com testes.
- [ ] [Marcio] Cobrir importacoes com testes.
- [ ] [Ambos] Criar E2E dos fluxos:
  - criar plano -> criar aluno -> registrar pagamento -> ver dashboard.
  - importar alunos -> abrir detalhe -> conferir status.
  - criar exercicio -> criar treino -> associar aluno.
- [ ] [Ambos] Adicionar logs para eventos criticos:
  - importacao.
  - registro de pagamento.
  - erro de IA.
- [ ] [Ambos] Preparar ambiente de homologacao/piloto.
- [ ] [Ambos] Criar checklist de onboarding de academia piloto.

Entregavel:

- MVP pronto para piloto controlado.

Criterio de pronto:

- Fluxos principais funcionam em desktop e mobile.
- Indicadores financeiros batem com dados de pagamento.
- Importacoes tratam erros de forma clara.
- Produto pode ser usado por uma academia sem intervencao tecnica diaria.

## Sequencia Recomendada de Sprints

### Sprint 1 - Fundacao e Navegacao

- Marco 0.
- Marco 1.
- Inicio dos tipos/seeds.

Resultado: app navegavel com dados base.

### Sprint 2 - Planos e Alunos

- Marco 2.
- Marco 3.

Resultado: cadastro operacional de planos e alunos.

### Sprint 3 - Financeiro Manual

- Marco 4.

Resultado: core financeiro funcionando sem gateway.

### Sprint 4 - Dashboard

- Marco 5.

Resultado: Home com insights reais e deeplinks.

### Sprint 5 - Importacao de Alunos

- Marco 6.

Resultado: onboarding por planilha.

### Sprint 6 - Exercicios

- Marco 7.

Resultado: biblioteca de exercicios manual/importavel.

### Sprint 7 - Treinos

- Marco 8.

Resultado: treinos editaveis associados a alunos.

### Sprint 8 - Check-in e IA

- Marco 9.
- Marco 10, se a base estiver estavel.

Resultado: frequencia basica e geracao assistida de treinos.

### Sprint 9 - Qualidade e Piloto

- Marco 11.

Resultado: MVP pronto para academia piloto.

## Divisao Paralela de Trabalho

Objetivo: permitir que Luis e Marcio avancem em paralelo com o minimo de conflito de arquivos e dependencias.

### Luis - Operacao, Alunos e Financeiro

Responsabilidade principal: fluxo plano -> aluno -> mensalidade -> pagamento -> dashboard.

Escopo:

- Marco 2 - Planos:
  - lista de planos.
  - formulario de plano.
  - criar, editar, ativar e inativar plano.
  - validacoes de valor e periodicidade.
  - quantidade de alunos vinculados.
  - testes de validacao.
- Marco 3 - Alunos:
  - lista e filtros.
  - formulario criar/editar.
  - associar aluno a plano ativo.
  - validar email/documento por academia.
  - detalhe do aluno com cadastro, financeiro, treinos e check-ins.
  - deeplinks para financeiro e treinos.
  - testes de validacao.
- Marco 4 - Financeiro Manual:
  - geracao de mensalidades.
  - lista e filtros de pagamentos.
  - registro, edicao e cancelamento.
  - regra de status financeiro.
  - historico financeiro no detalhe do aluno.
  - testes unitarios financeiros.
- Marco 5 - Dashboard Operacional:
  - agregadores da Home.
  - cards financeiros e operacionais.
  - listas acionaveis.
  - deeplinks.
  - validacao dos numeros contra financeiro.
- Marco 9 - Check-in Simples:
  - registrar check-in manual.
  - evitar duplicidade no mesmo dia, se definido.
  - historico no detalhe do aluno.
  - card de check-ins de hoje.

Arquivos/modulos principais:

- `src/domain/plans/`.
- `src/domain/students/`.
- `src/domain/payments/`.
- `src/domain/check-ins/`.
- `src/pages/PlansPage.tsx`.
- `src/pages/StudentsPage.tsx`.
- `src/pages/StudentDetailPage.tsx`.
- `src/pages/FinancePage.tsx`.
- `src/App.tsx`.
- `src/server/`.
- migrations Prisma relacionadas a planos, alunos, pagamentos e check-ins.

### Marcio - Importacao, Exercicios, Treinos e IA

Responsabilidade principal: fluxo exercicio -> treino -> associacao ao aluno e onboarding por planilha.

Escopo:

- Marco 7 - Exercicios:
  - lista e filtros.
  - formulario criar/editar/inativar.
  - imagem e video por URL.
  - modelo de planilha.
  - importacao CSV/XLSX.
  - validacao de duplicidade.
  - testes.
- Marco 8 - Treinos:
  - lista e formulario.
  - estrutura de dias A/B/C/outros.
  - adicionar exercicios ao dia.
  - campos por exercicio no treino.
  - associar treino ao aluno.
  - duplicar e inativar.
  - exibir treinos no detalhe do aluno.
  - modelo e importacao CSV/XLSX de treinos.
  - testes de montagem e associacao.
- Marco 6 - Importacao de Alunos CSV/XLSX:
  - modelo de planilha.
  - upload CSV/XLSX.
  - preview.
  - mapeamento de colunas.
  - validacoes obrigatorias e duplicidade.
  - erro por linha e campo.
  - confirmacao de importacao.
  - `ImportBatch` e `ImportError`.
  - testes.
- Marco 10 - IA de Treinos:
  - modelo de prompt.
  - formulario de geracao.
  - chamada LLM por ambiente.
  - parser/normalizador.
  - validacao antes de salvar.
  - edicao antes de associar.
  - fallback de erro.
  - testes.
- Parte do Marco 11 - Qualidade e Piloto:
  - E2E criar exercicio -> criar treino -> associar aluno.
  - testes de importacao.
  - logs de importacao e erro de IA.

Arquivos/modulos principais:

- `src/domain/exercises/`.
- `src/domain/workouts/`.
- `src/domain/imports/`.
- `src/pages/ExercisePage.tsx`.
- `src/pages/WorkoutsPage.tsx`.
- `src/pages/WorkoutDetailPage.tsx`.
- `src/pages/ImportPage.tsx`.
- componentes especificos de importacao, exercicios e treinos.
- migrations Prisma relacionadas apenas se combinadas antes.

### Ordem Recomendada para Paralelizar

Rodada 1:

- Luis: Marco 2 - Planos.
- Marcio: Marco 7 - Exercicios.

Rodada 2:

- Luis: Marco 3 - Alunos.
- Marcio: Marco 8 - Treinos.

Rodada 3:

- Luis: Marco 4 - Financeiro Manual.
- Marcio: Marco 6 - Importacao de Alunos.

Rodada 4:

- Luis: Marco 5 - Dashboard e Marco 9 - Check-in.
- Marcio: Marco 10 - IA de Treinos.

Rodada 5:

- Ambos: Marco 11 - Qualidade e Piloto.
- Luis cobre o fluxo plano -> aluno -> pagamento -> dashboard.
- Marcio cobre importar alunos e exercicio -> treino -> aluno.

### Arquivos Compartilhados que Exigem Coordenacao

Evitar alteracoes simultaneas sem combinar antes:

- `prisma/schema.prisma`.
- `src/app/routes.tsx`.
- `src/material/MaterialShell.tsx`.
- `src/material/PagePattern.tsx`.
- `src/App.tsx`.
- `src/domain/fixtures/mvpSeedData.js`.
- `prisma/seed.js`.

Quando um desses arquivos precisar mudar, preferir PR pequeno e isolado antes de continuar na feature principal.

## Backlog Pos-MVP

- Integracao Stripe.
- PIX automatico.
- Importacao de pagamentos/extratos.
- Regua de cobranca com WhatsApp.
- Relatorios exportaveis avancados.
- Multi-unidade.
- App ou area do aluno mais completa.
- QR Code check-in.
- Bloqueio por inadimplencia.
