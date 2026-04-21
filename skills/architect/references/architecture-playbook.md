# Architecture Playbook

## Principios

- Comecar simples e evoluir por necessidade real.
- Isolar regra de negocio de framework, banco e transporte.
- Padronizar contratos e convencoes cedo.
- Favorecer modulos pequenos, legiveis e testaveis.
- Garantir observabilidade, seguranca e confiabilidade sem comprometer simplicidade.

## Diretrizes para React

- Organizar por dominio ou feature, nao apenas por tipo tecnico.
- Manter componentes de apresentacao simples.
- Concentrar logica de orquestracao em hooks, services ou cases bem nomeados.
- Evitar estado global desnecessario.
- Tratar acessibilidade, performance e testabilidade como requisitos basicos.

## Diretrizes para Node.js

- Separar rotas/controllers, casos de uso, entidades e adapters.
- Deixar validacao de entrada explicita.
- Encapsular acesso a banco e servicos externos atras de portas claras.
- Usar contratos e tratamento consistente de erros.
- Instrumentar logs, metricas e tracing de forma proporcional.

## Testes

- Testar dominio e aplicacao com foco em comportamento.
- Testar adaptadores e interfaces com integracao seletiva.
- Evitar depender demais de mocks em regras centrais.
- Manter meta minima de 85% de cobertura total e cobertura forte nas regras de negocio.
