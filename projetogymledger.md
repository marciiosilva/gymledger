# Projeto GymLedger

Use este arquivo como fonte principal de especificacao do produto.

## Visao do produto

### problema que o GymLedger resolve

Academias hoje enfrentam problemas críticos:

- Alta inadimplência de alunos  
- Falta de controle sobre receita recorrente  
- Processos manuais de cobrança  
- Baixa previsibilidade de caixa  
- Sistemas antigos focados apenas em presença
- Falta de integração com pagamentos modernos  
- Falta de padronização na criação de treinos  
- Baixa escalabilidade da operação de professores  

Resultado: perda de dinheiro + gestão ineficiente

---

### publico-alvo

Primário:
- Donos de academias pequenas e médias
- Studios de treino funcional, crossfit ou musculação

Secundário:
- Redes de academias (multi-unidade)
- Personal trainers com carteira de alunos

Usuários do sistema:
- Admin (dono/gestor)
- Professor (trainer)
- Aluno (usuário final)

---

### objetivos de negocio

- Aumentar retenção de receita (reduzir inadimplência)
- Automatizar faturamento recorrente
- Melhorar previsibilidade financeira
- Reduzir esforço operacional
- Criar SaaS escalável (modelo B2B)
- Possibilitar expansão internacional (Stripe-first)

---

## MVP

### funcionalidades obrigatorias

Financeiro (core):
- Criação de planos
- Assinaturas recorrentes via Stripe
- Status de pagamento: ativo, atrasado, cancelado
- Webhooks Stripe para atualização automática
- Dashboard com:
  - MRR
  - Receita prevista vs recebida
  - Inadimplência

Alunos:
- Cadastro de aluno
- Associação a plano
- Status do aluno (financeiro e operacional)

Treinos (mínimo viável com IA):
- Criar treino manual
- Gerar treino com IA (inputs básicos)
- Editar treino gerado
- Associar treino ao aluno

Controle:
- Lista de alunos
- Lista de pagamentos
- Histórico por aluno

---

### funcionalidades desejaveis

- QR Code check-in
- Bloqueio automático por inadimplência
- Notificação de falha de pagamento
- Templates de treino reutilizáveis
- Relatórios financeiros exportáveis
- Multi-unidade (multi-tenant avançado)
- App mobile para alunos

---

### fora de escopo

- Integração com catracas físicas
- BI avançado
- IA avançada de performance física
- Integração com wearables
- Marketplace de treinos
- Gamificação avançada

---

## Regras de negocio

### regras centrais

- Um aluno deve estar associado a um plano ativo ou estar inativo
- Um plano gera uma assinatura Stripe
- O status financeiro do aluno depende do retorno do Stripe
- Treinos devem ser sempre editáveis, inclusive os gerados por IA
- Um aluno pode ter múltiplos treinos ao longo do tempo
- O sistema deve priorizar consistência entre dados financeiros e operacionais

---

### restricoes

- Isolamento total entre academias (multi-tenant)
- Não permitir acesso entre tenants
- Um aluno não pode ter duas assinaturas ativas simultâneas
- Bloqueio de check-in se inadimplente (configurável)

---

### validacoes importantes

- Email único por aluno dentro da academia
- Plano deve ter valor maior que zero
- Frequência de treino válida (1 a 7 dias)
- Inputs mínimos obrigatórios para IA:
  - objetivo
  - nível
- Webhooks Stripe devem ser idempotentes
- Datas de cobrança devem ser consistentes com o plano

---

## Frontend

### principais telas

Admin:
- Dashboard
- Alunos (lista e detalhe)
- Financeiro (pagamentos)
- Planos
- Treinos (lista e criação)

Professor:
- Lista de alunos
- Criar treino
- Editar treino

Aluno:
- Meu treino
- Status da assinatura
- Histórico de treinos

---

### fluxos do usuario

Admin:
1. Cria plano
2. Cadastra aluno
3. Associa plano (cria assinatura)
4. Acompanha pagamentos

Professor:
1. Seleciona aluno
2. Cria treino manual ou com IA
3. Ajusta treino
4. Salva

Aluno:
1. Acessa treino
2. Executa treino
3. Marca como concluído

---

### requisitos de UX e UI

- Interface simples e intuitiva
- Minimizar número de cliques
- Feedback visual claro com cores de status
- IA deve ser rápida e fácil de usar
- Mobile-first para alunos
- Design moderno estilo SaaS (clean, cards, tabelas, badges)

---

## Backend

### entidades

- Gym
- User
- Student
- Plan
- Subscription
- Payment
- Workout
- Exercise
- WorkoutAssignment
- CheckIn

---

### casos de uso

- Criar aluno
- Criar plano
- Criar assinatura Stripe
- Receber webhook de pagamento
- Atualizar status do aluno
- Gerar treino via IA
- Editar e salvar treino
- Buscar dados para dashboard

---

### integracoes

Stripe:
- Customers
- Subscriptions
- Webhooks

IA:
- Serviço de geração de treino baseado em prompt
- Processamento assíncrono opcional

---

### requisitos de seguranca

- Autenticação via token (JWT ou similar)
- Autorização baseada em roles
- Isolamento multi-tenant
- Validação de assinatura dos webhooks Stripe
- Proteção contra replay de requisições
- Rate limiting em endpoints críticos (especialmente IA)

---

## Qualidade

### metas de performance

- API sem IA: < 300ms
- Resposta IA: < 3s
- Dashboard: < 1s de carregamento

---

### observabilidade

- Logs estruturados
- Monitoramento de erros
- Monitoramento de pagamentos
- Métricas de performance
- Integração futura com ferramentas como Sentry ou Datadog

---

### estrategia de testes

- Unit tests para regras de negócio
- Integration tests para Stripe
- Testes de webhook
- Testes E2E para fluxos críticos

---

### cobertura minima desejada

- Backend: 70%
- Regras críticas: 90%
- Frontend: componentes principais

---

## Duvidas abertas

- Qual stack final será utilizada (Flutter vs React)? Resposta: React
- Estratégia de multi-tenant (schema isolado vs compartilhado)? Resposta: schema isolado
- Integração com PIX será incluída no MVP ou depois? Resposta: Primeiro vamos com a Stripe
- Modelo de pricing será fixo ou por aluno? Resposta: Fixo para a academia
- Qual nível de inteligência da IA no início? Resposta: Pode usar a LLM da Open AI com uma Key nossa
- Aplicativo mobile será lançado junto ou depois? Resposta: Primeira versão deve ser react responsivo
- Bloqueio de acesso será padrão ou opcional? Resposta: Opicional
- Quais requisitos de LGPD serão aplicáveis inicialmente? Resposta: Todos os aplicáveis

---

## Observacao estrategica

GymLedger não é um sistema de academia tradicional.

É uma plataforma de controle financeiro e previsibilidade de receita para academias.

O sucesso do produto depende de:
- resolver inadimplência
- automatizar cobrança
- dar visibilidade clara de receita

Se isso for bem feito, o produto terá alto valor percebido e retenção.
