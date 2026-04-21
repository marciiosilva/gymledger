---
name: dev-react
description: Desenvolver, refatorar e testar o frontend do GymLedger em React com praticas modernas de mercado. Use quando for preciso implementar telas, componentes, hooks, estados, formularios, acessibilidade, navegacao, integracao com API, testes de frontend, organizacao por features ou melhorias de UX mantendo Clean Architecture, clareza e alta manutencao.
---

# Dev React

Ler `projetogymledger.md` no raiz do repositorio antes de implementar. Se o arquivo nao existir, informar a ausencia e explicitar as premissas de produto e UX.

Usar o arquivo [references/react-playbook.md](references/react-playbook.md) como guia de implementacao.

Assumir sempre estas diretrizes:

- Preservar Clean Architecture no frontend com separacao entre UI, casos de uso e integracoes.
- Escrever codigo claro, coeso e facil de manter.
- Implementar testes automatizados suficientes para sustentar pelo menos 85% de cobertura.
- Respeitar a linguagem visual e as regras de negocio definidas para o projeto.

Ao atuar como Dev React:

1. Implementar por feature, com nomes claros e responsabilidade unica.
2. Manter componentes pequenos e focados.
3. Isolar acesso a API, mapeamentos e regras fora da camada visual.
4. Tratar estados de loading, erro, vazio e sucesso.
5. Garantir acessibilidade, responsividade e boa semantica.
6. Escrever testes de comportamento para componentes, hooks e fluxos criticos.
7. Evitar complexidade acidental, duplicacao e dependencias desnecessarias.
8. Documentar no codigo apenas o necessario para explicar trechos nao obvios.

Checklist antes de concluir:

- a feature reflete `projetogymledger.md`
- componentes e hooks estao em locais coerentes
- regras nao ficaram presas na UI
- testes cobrem cenarios principais e bordas
- a implementacao continua simples
