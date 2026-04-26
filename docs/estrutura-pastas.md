# Estrutura de Pastas - GymLedger MVP

Este guia define onde cada tipo de codigo deve viver durante o MVP. A regra principal e separar regra de negocio, interface, dados de apoio e infraestrutura para evitar componentes de tela com logica financeira ou de tenant embutida.

## Visao Geral

```text
src/
  app/                 Composicao da aplicacao, rotas e providers globais.
  components/          Componentes reutilizaveis do produto, sem regra de dominio.
  data/                Mocks, fixtures e adaptadores temporarios de dados.
  design-system/       Primitivos, tokens e padroes visuais reutilizaveis.
  domain/              Regras de negocio, tipos, validacoes e servicos por modulo.
  material/            Tema, shell e componentes MUI especificos da casca atual.
  pages/               Paginas roteaveis e composicao de telas.
  server/              API Node.js, Auth, Prisma e integracoes server-side.
  test/                Helpers de teste compartilhados.
```

## Dominio

`src/domain/` concentra regras testaveis e independentes de tela. Cada modulo deve ter seus arquivos perto uns dos outros:

```text
src/domain/
  gyms/
  users/
  plans/
  students/
  payments/
  workouts/
  exercises/
  check-ins/
  imports/
```

Padrao recomendado por modulo:

```text
src/domain/plans/
  planTypes.ts         Tipos e contratos do modulo.
  planValidation.ts    Validacoes puras.
  planService.ts       Casos de uso e orquestracao.
  planRepository.ts    Acesso a dados quando houver implementacao Prisma.
  planFixtures.ts      Fixtures especificas de testes ou mocks.
  *.test.ts            Testes unitarios das regras.
```

Regras financeiras, calculos de status, validacoes de importacao e escopo por `gymId` devem ficar em `domain/`, nao em `pages/`.

## Componentes

Use `src/components/` para componentes compartilhados do produto, como filtros, estados de pagina, toolbars e formularios genericos. Eles podem receber dados e callbacks, mas nao devem chamar Prisma, Supabase ou regras financeiras diretamente.

O `src/design-system/` continua reservado para primitivos e padroes visuais mais basicos. O `src/material/` continua como camada MUI da shell atual ate uma futura consolidacao.

## Paginas

`src/pages/` deve conter somente composicao de tela e conexao entre componentes, rotas e casos de uso. Paginas podem chamar servicos do dominio ou hooks de dados, mas nao devem implementar calculos de mensalidade, status financeiro ou parsing de importacao.

Padrões de pagina compartilhados ficam em `src/material/PagePattern.tsx`:

- `PageSectionHeader` para titulo de secao, subtitulo curto e acao contextual.
- `PageFilterPanel` para expandir/minimizar filtros de lista.
- `PageState` para estados `loading`, `empty`, `error` e `no-results`.

Checklist responsivo minimo para paginas:

- Grids principais devem usar `xs: "1fr"` e so dividir colunas em breakpoints maiores.
- Tabelas densas devem ficar dentro de `TableContainer` com `overflowX: "auto"` e `minWidth` estavel.
- Textos em cards, listas e sidebars devem usar `minWidth: 0` antes de `noWrap`.
- A navegacao principal deve funcionar no drawer permanente do desktop e no drawer temporario do mobile.

## Dados

`src/data/` guarda mocks atuais e dados de apoio para telas enquanto o backend real evolui. Conforme os CRUDs forem entrando, mover fixtures especificas para o modulo em `src/domain/<modulo>/` e deixar `data/` apenas para datasets compartilhados ou temporarios.

## Backend

`src/server/` contem API Node.js, validacao de Auth, cliente Prisma e integracoes server-side. Regras de negocio reutilizaveis devem ser importadas de `src/domain/`; handlers HTTP devem apenas validar request, chamar caso de uso e responder JSON.

## Testes

- Testes colocados ao lado do arquivo testado: `*.test.ts`, `*.test.tsx` ou `*.test.jsx`.
- Helpers globais ficam em `src/test/`.
- Regras de negocio criticas devem ter testes unitarios em `src/domain/<modulo>/`.
- Fluxos completos futuros devem ficar em uma pasta propria de E2E quando o projeto adotar Playwright/Cypress.
