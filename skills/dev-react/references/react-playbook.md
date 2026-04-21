# React Playbook

## Estrutura

- Organizar por feature ou dominio.
- Separar componentes, hooks, casos de uso, gateways e testes de forma previsivel.
- Evitar pastas genericas que virem deposito de codigo.

## Implementacao

- Preferir componentes funcionais pequenos e composicao.
- Usar hooks customizados para orquestrar comportamento reutilizavel.
- Deixar formatacao, validacao e transformacoes fora do JSX sempre que possivel.
- Tratar formularios com validacao clara e mensagens objetivas.
- Controlar side effects com cuidado e previsibilidade.

## Qualidade

- Garantir acessibilidade minima com labels, foco, semantica e teclado.
- Considerar performance sem antecipar otimizacoes desnecessarias.
- Escrever testes com foco na experiencia e no comportamento esperado.
- Buscar cobertura total minima de 85%, com prioridade para fluxos criticos.

## Integracao

- Encapsular clientes HTTP e contratos.
- Tratar erros de API com estados e mensagens consistentes.
- Mapear DTOs para modelos internos quando isso aumentar clareza.
