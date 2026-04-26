# PRD - GymLedger MVP

## 1. Resumo

GymLedger e uma plataforma web responsiva para academias, studios e personal trainers controlarem alunos, mensalidades, inadimplencia e treinos em um unico lugar.

O MVP deve priorizar uma operacao simples: importar ou cadastrar alunos, associar planos, registrar pagamentos manualmente, acompanhar indicadores financeiros e criar/importar treinos e exercicios.

Nesta primeira versao, nao havera integracao com Stripe ou gateway de pagamento. O financeiro sera controlado internamente a partir de pagamentos registrados pelo usuario.

## 2. Objetivos

- Dar visibilidade diaria sobre receita, inadimplencia, alunos e treinos.
- Reduzir dependencia de planilhas para cadastro de alunos e controle financeiro.
- Permitir onboarding rapido com importacao CSV/XLSX.
- Centralizar o historico financeiro e de treinos por aluno.
- Criar uma base tecnica preparada para integracoes futuras de pagamento.

## 3. Nao Objetivos do MVP

- Integracao Stripe, PIX automatico ou gateway de pagamento.
- App mobile nativo.
- Integracao com catraca.
- BI avancado.
- Marketplace de treinos.
- Automacao de WhatsApp ou email.
- IA avancada de performance fisica.

## 4. Personas

### Admin / Gestor

Dono ou gerente da academia. Precisa saber quem esta pagando, quem esta atrasado, quanto entrou no mes e quais alunos precisam de atencao.

### Professor

Profissional que cria treinos, consulta alunos e acompanha restricoes, objetivos e historico de treino.

### Aluno

Usuario final que, em versoes futuras ou acesso responsivo limitado, podera consultar treino, status e historico.

No MVP, o foco principal de interface e Admin/Professor.

## 5. Escopo Funcional

### 5.1 Home / Dashboard

Objetivo: ser a tela inicial de decisao do gestor.

Requisitos:

- Exibir cards de indicadores:
  - Check-ins de hoje.
  - Alunos ativos.
  - Alunos inadimplentes.
  - Receita recebida no mes.
  - Receita prevista no mes.
  - Valor a receber.
  - Treinos ativos.
- Exibir insights acionaveis:
  - Lista curta de alunos inadimplentes.
  - Alunos sem treino ativo.
  - Pagamentos vencendo nos proximos dias.
  - Evolucao simples de receita mensal.
- Ter acoes rapidas:
  - Cadastrar novo aluno.
  - Importar alunos.
  - Registrar pagamento.
  - Criar treino.
- Ter deeplinks para:
  - Cadastro de aluno.
  - Financeiro filtrado por inadimplentes.
  - Detalhe do aluno.
  - Treinos do aluno.

Critérios de aceite:

- O usuario consegue chegar ao cadastro de novo aluno em 1 clique a partir da Home.
- Indicadores refletem os dados cadastrados/importados.
- Cards vazios mostram estado vazio util, sem quebrar layout.

### 5.2 Alunos

Objetivo: gerenciar cadastro, status, plano, financeiro e treinos do aluno.

Requisitos:

- Listar alunos com filtros por:
  - Nome.
  - Status operacional.
  - Status financeiro.
  - Plano.
  - Alunos sem treino.
- Cadastrar e editar aluno com:
  - Nome completo.
  - Email.
  - Telefone/WhatsApp.
  - CPF/documento.
  - Data de nascimento.
  - Endereco basico.
  - Contato de emergencia.
  - Objetivo.
  - Nivel.
  - Restricoes fisicas/observacoes medicas.
  - Plano.
  - Data de inicio.
  - Status ativo/inativo.
- Importar alunos via CSV/XLSX.
- Validar importacao antes de confirmar.
- Exibir erros de importacao por linha e campo.
- Evitar duplicidade por email e/ou documento dentro da academia.
- Detalhe do aluno com:
  - Dados cadastrais.
  - Status financeiro.
  - Plano atual.
  - Historico de pagamentos.
  - Treinos vinculados.
  - Check-ins.
  - Links para financeiro e treinos.

Critérios de aceite:

- Usuario consegue cadastrar aluno manualmente.
- Usuario consegue importar uma planilha valida de alunos.
- Linhas invalidas nao sao importadas sem confirmacao.
- O detalhe do aluno permite navegar para financeiro e treinos do aluno especifico.

### 5.3 Financeiro

Objetivo: controlar planos, matriculas/mensalidades, pagamentos e inadimplencia sem gateway externo.

Requisitos:

- CRUD de planos:
  - Nome.
  - Valor.
  - Periodicidade: mensal, trimestral, semestral, anual.
  - Dia de vencimento padrao.
  - Status ativo/inativo.
- Associar aluno a um plano ativo.
- Gerar mensalidades a partir do plano e data de inicio.
- Listar pagamentos/mensalidades com:
  - Aluno.
  - Plano.
  - Valor.
  - Vencimento.
  - Data de pagamento.
  - Status: pago, pendente, atrasado, cancelado.
  - Tipo de pagamento: dinheiro, cartao, PIX, transferencia, outro.
- Registrar pagamento manual.
- Editar pagamento.
- Cancelar mensalidade.
- Filtrar por status, periodo, plano e tipo de pagamento.
- Mostrar insights:
  - Receita recebida no mes.
  - Receita prevista no mes.
  - Valor a receber.
  - Valor em atraso.
  - Taxa de inadimplencia.
  - Quantidade de alunos inadimplentes.
  - Distribuicao por tipo de pagamento.

Regras:

- Um aluno pode ter apenas um plano ativo por vez.
- Plano deve ter valor maior que zero.
- Mensalidade vencida e nao paga deve virar atrasada.
- Status financeiro do aluno deve ser calculado a partir das mensalidades.

Critérios de aceite:

- Usuario consegue criar plano, associar aluno e registrar pagamento.
- Inadimplencia aparece corretamente quando existe mensalidade vencida nao paga.
- Dashboard financeiro atualiza apos registro de pagamento.
- Nao existe dependencia de Stripe ou webhook no MVP.

### 5.4 Treinos e Exercicios

Objetivo: criar, importar e associar treinos aos alunos.

Requisitos:

- CRUD de exercicios:
  - Nome.
  - Grupo muscular.
  - Descricao/instrucoes.
  - Foto ou URL de imagem.
  - Video ou URL de video.
  - Observacoes tecnicas.
- Importar exercicios via CSV/XLSX.
- CRUD de treinos:
  - Nome.
  - Objetivo.
  - Nivel.
  - Frequencia semanal.
  - Descricao geral.
  - Status ativo/inativo.
- Estruturar treino por dias:
  - Dia A, B, C etc.
  - Lista de exercicios por dia.
  - Series.
  - Repeticoes.
  - Carga sugerida.
  - Descanso.
  - Observacoes.
- Importar treinos via CSV/XLSX.
- Associar treino ao aluno.
- Duplicar treino.
- Editar treino gerado/importado.
- Opcional no MVP, se houver tempo: gerar treino com IA usando objetivo, nivel, frequencia e restricoes.

Critérios de aceite:

- Usuario consegue criar exercicios manualmente.
- Usuario consegue importar exercicios por planilha.
- Usuario consegue criar treino e associar a um aluno.
- Treino importado ou gerado permanece editavel.

### 5.5 Check-ins

Objetivo: fornecer indicador simples para Home e historico do aluno.

Requisitos:

- Registrar check-in manual do aluno.
- Listar historico de check-ins no detalhe do aluno.
- Mostrar total de check-ins do dia na Home.

Fora do MVP:

- QR Code.
- Bloqueio automatico por inadimplencia.
- Integracao com catraca.

## 6. Dados e Entidades

Entidades minimas:

- Gym.
- User.
- Student.
- Plan.
- Payment.
- Workout.
- WorkoutDay.
- Exercise.
- WorkoutAssignment.
- CheckIn.
- ImportBatch.
- ImportError.

Campos devem sempre carregar `gymId` ou respeitar isolamento por schema/tenant definido pela arquitetura.

## 7. Importacao CSV/XLSX

Requisitos comuns:

- Aceitar CSV e XLSX.
- Mostrar preview antes de gravar.
- Permitir mapear colunas quando os nomes nao baterem exatamente.
- Validar campos obrigatorios.
- Apontar erro por linha.
- Permitir baixar/exportar modelo de planilha.
- Registrar historico da importacao.

Importacoes do MVP:

- Alunos.
- Exercicios.
- Treinos.

Importacoes futuras:

- Pagamentos.
- Extratos.
- Planos.

## 8. Requisitos Nao Funcionais

- React responsivo.
- Interface limpa, objetiva e orientada a operacao.
- Dashboard deve carregar em ate 1s com dados do MVP.
- API sem IA deve responder em ate 300ms em cenarios comuns.
- Isolamento entre academias.
- Autenticacao via token ou provedor definido.
- Autorizacao por role: admin, professor, aluno.
- Sanitizacao de arquivos importados.
- Logs estruturados para eventos criticos.

## 9. Metricas de Sucesso

- Tempo para cadastrar/importar primeira base de alunos.
- Percentual de usuarios que criam plano e associam aluno.
- Percentual de alunos com status financeiro correto.
- Quantidade de pagamentos registrados por semana.
- Uso da Home como primeira tela operacional.
- Reducao de controle manual fora do sistema.

## 10. Roadmap de Execucao Ordenado

### Fase 0 - Fundacao do Produto

1. Definir stack backend, banco, ORM e autenticacao.
2. Definir estrategia multi-tenant.
3. Criar schema inicial das entidades.
4. Criar seed de academia, usuarios, planos, alunos, pagamentos e treinos.
5. Definir padrao visual e componentes reutilizaveis para tabelas, filtros, forms, badges e empty states.

Entrega esperada: base tecnica pronta para CRUDs e dashboard.

### Fase 1 - Navegacao e Layout Principal

1. Estruturar rotas principais: Home, Alunos, Financeiro, Planos, Treinos, Exercicios.
2. Criar shell da aplicacao com sidebar/topbar.
3. Criar estados de loading, vazio e erro.
4. Padronizar filtros e acoes de lista.

Entrega esperada: usuario consegue navegar por todos os modulos, ainda que com dados mockados.

### Fase 2 - Planos e Alunos

1. Implementar CRUD de planos.
2. Implementar CRUD de alunos.
3. Associar aluno a plano.
4. Calcular status operacional e financeiro inicial.
5. Criar pagina de detalhe do aluno.
6. Adicionar links do aluno para financeiro e treinos.

Entrega esperada: base de alunos funcional com plano vinculado.

### Fase 3 - Financeiro Manual

1. Gerar mensalidades a partir do plano.
2. Implementar lista de pagamentos/mensalidades.
3. Registrar pagamento manual.
4. Editar/cancelar mensalidade.
5. Calcular inadimplencia.
6. Criar filtros por status, periodo, plano e tipo de pagamento.
7. Exibir historico financeiro no detalhe do aluno.

Entrega esperada: controle financeiro manual completo para o MVP.

### Fase 4 - Dashboard

1. Criar agregadores de dados para Home.
2. Implementar cards de indicadores.
3. Implementar listas curtas de acao: inadimplentes, vencimentos proximos, alunos sem treino.
4. Criar deeplink para cadastrar novo aluno.
5. Criar deeplinks para filtros financeiros e detalhe do aluno.
6. Validar consistencia dos numeros com financeiro.

Entrega esperada: Home operacional com insights reais.

### Fase 5 - Importacao de Alunos

1. Criar modelo de planilha de alunos.
2. Implementar upload CSV/XLSX.
3. Implementar preview e mapeamento de colunas.
4. Validar obrigatorios, email/documento duplicado e formatos.
5. Confirmar importacao.
6. Registrar ImportBatch e ImportError.

Entrega esperada: onboarding de base de alunos por planilha.

### Fase 6 - Exercicios

1. Implementar CRUD de exercicios.
2. Suportar imagem/URL e video/URL.
3. Implementar importacao CSV/XLSX de exercicios.
4. Criar filtros por nome e grupo muscular.

Entrega esperada: biblioteca inicial de exercicios manual e importavel.

### Fase 7 - Treinos

1. Implementar CRUD de treinos.
2. Criar estrutura por dias de treino.
3. Adicionar exercicios ao treino.
4. Associar treino ao aluno.
5. Duplicar treino.
6. Implementar importacao CSV/XLSX de treinos.
7. Exibir treinos no detalhe do aluno.

Entrega esperada: gestao de treinos vinculada ao aluno.

### Fase 8 - Check-in Simples

1. Registrar check-in manual.
2. Exibir historico no aluno.
3. Atualizar card de check-ins na Home.

Entrega esperada: indicador basico de frequencia.

### Fase 9 - IA de Treinos

1. Definir prompt base.
2. Criar formulario com objetivo, nivel, frequencia e restricoes.
3. Gerar treino via LLM.
4. Converter resposta para estrutura editavel.
5. Salvar treino gerado.
6. Associar treino ao aluno.

Entrega esperada: geracao assistida de treino, sempre editavel.

### Fase 10 - Qualidade, Piloto e Ajustes

1. Testes unitarios de regras financeiras.
2. Testes de importacao CSV/XLSX.
3. Testes E2E dos fluxos criticos.
4. Revisao de responsividade.
5. Revisao de permissao por role.
6. Observabilidade basica.
7. Preparar ambiente de piloto.

Entrega esperada: MVP pronto para uso com academias piloto.

## 11. Ordem Recomendada de Implementacao

1. Fundacao tecnica.
2. Layout e rotas.
3. Planos.
4. Alunos.
5. Financeiro manual.
6. Dashboard.
7. Importacao de alunos.
8. Exercicios.
9. Importacao de exercicios.
10. Treinos.
11. Importacao de treinos.
12. Check-in simples.
13. IA de treinos.
14. Testes, responsividade e piloto.

## 12. Criterio de Pronto do MVP

- Admin consegue cadastrar plano, aluno e pagamento manual.
- Admin consegue importar alunos por CSV/XLSX.
- Professor/Admin consegue criar e importar exercicios.
- Professor/Admin consegue criar e importar treinos.
- Treino pode ser associado ao aluno.
- Home mostra indicadores reais de alunos, financeiro, treinos e check-ins.
- Financeiro calcula inadimplencia sem Stripe.
- Detalhe do aluno centraliza cadastro, financeiro, treinos e check-ins.
- Fluxos principais funcionam em desktop e mobile.
- Testes cobrem regras financeiras e importacao.

