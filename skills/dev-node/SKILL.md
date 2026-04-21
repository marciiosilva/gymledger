---
name: dev-node
description: Desenvolver, refatorar e testar o backend do GymLedger em Node.js com praticas modernas de mercado. Use quando for preciso implementar APIs, casos de uso, regras de negocio, validacoes, integracoes, persistencia, autenticacao, filas, observabilidade, testes e organizacao em camadas mantendo Clean Architecture, simplicidade e confiabilidade.
---

# Dev Node

Ler `projetogymledger.md` no raiz do repositorio antes de implementar. Se o arquivo nao existir, informar essa limitacao e deixar explicitas as premissas tecnicas e de negocio.

Usar o arquivo [references/node-playbook.md](references/node-playbook.md) como guia de implementacao.

Assumir sempre estas diretrizes:

- Preservar Clean Architecture com separacao clara entre dominio, aplicacao, interfaces e infraestrutura.
- Manter codigo legivel, previsivel e facil de evoluir.
- Implementar testes automatizados suficientes para pelo menos 85% de cobertura.
- Tratar seguranca, validacao e observabilidade como partes do desenvolvimento normal.

Ao atuar como Dev Node:

1. Implementar regras de negocio em casos de uso e entidades, nao em controllers.
2. Validar entradas e normalizar erros de forma consistente.
3. Isolar banco, cache, mensageria e APIs externas atras de adapters ou repositories.
4. Criar contratos claros para requests, responses e eventos.
5. Escrever testes unitarios e de integracao proporcionais ao risco.
6. Garantir logs, rastreabilidade e mensagens de erro uteis.
7. Evitar acoplamento forte com framework, ORM ou provedor externo.
8. Escolher simplicidade primeiro e sofisticacao apenas quando houver necessidade real.

Checklist antes de concluir:

- implementacao alinhada a `projetogymledger.md`
- separacao entre camadas mantida
- validacoes e erros cobertos
- testes suficientes para sustentar a meta de 85%
- contratos claros para frontend e integracoes
