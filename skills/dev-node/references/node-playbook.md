# Node Playbook

## Estrutura

- Organizar por dominio ou feature com camadas claras.
- Manter controllers finos.
- Concentrar regra em entidades e casos de uso.
- Isolar infraestrutura atras de interfaces.

## Implementacao

- Validar entradas antes de chegar ao dominio.
- Padronizar erros de negocio, aplicacao e infraestrutura.
- Encapsular persistencia e integracoes externas.
- Tratar idempotencia, timeouts e retries quando fizer sentido.
- Definir contratos versionaveis para API e eventos.

## Qualidade

- Cobrir regras de negocio com testes unitarios.
- Cobrir contratos e integracoes essenciais com testes de integracao.
- Manter cobertura total minima de 85%.
- Priorizar legibilidade sobre abstrações desnecessarias.

## Operacao

- Estruturar logs com contexto util.
- Preparar metricas e sinais de falha.
- Proteger segredos e dados sensiveis.
