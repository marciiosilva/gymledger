# Guia de Testes — GymLedger Backend

## Filosofia

- **Services testam regras de negócio.** Controllers, módulos e DTOs são excluídos da coleta de cobertura — sua cobertura vem dos testes de integração/E2E.
- **Sem banco de dados real.** Todo acesso ao Prisma é mockado via `jest.fn()`.
- **Sem Supabase real.** O cliente Supabase é mockado via `jest.mock('@supabase/supabase-js')`.
- **Datas determinísticas.** Use `jest.useFakeTimers()` em qualquer teste que dependa de `new Date()`.

---

## Estrutura

Cada arquivo de service deve ter um `.spec.ts` co-localizado:

```
src/
  plans/
    plans.service.ts
    plans.service.spec.ts   ← aqui
  students/
    students.service.ts
    students.service.spec.ts
```

---

## Template para novo service

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MeuService } from './meu.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  meuModel: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('MeuService', () => {
  let service: MeuService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks(); // obrigatório para isolar testes
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeuService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MeuService>(MeuService);
    prisma = module.get(PrismaService);
  });

  describe('nomeDoMetodo', () => {
    it('descrição do caminho feliz', async () => {
      prisma.meuModel.findMany.mockResolvedValue([/* dados */]);

      const result = await service.nomeDoMetodo('gym-id');

      expect(result).toEqual([/* esperado */]);
    });

    it('lança NotFoundException quando recurso não encontrado', async () => {
      prisma.meuModel.findFirst.mockResolvedValue(null);

      await expect(service.nomeDoMetodo('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
```

---

## Mock do Prisma

Monte o objeto mock com apenas os métodos que o service usa. Não é necessário incluir todo o PrismaClient.

```typescript
const mockPrisma = {
  plan: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  mensalidade: {
    createMany: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};
```

**Regra:** `jest.clearAllMocks()` no `beforeEach` — obrigatório para evitar contaminação entre testes.

---

## Mock do Supabase

Para services/guards que usam `createClient` (AuthService, AuthGuard):

```typescript
import { createClient } from '@supabase/supabase-js';

// Hoistado pelo Jest — deve ficar antes de qualquer import do módulo
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('MeuService', () => {
  let mockSupabaseAuth: any;

  beforeEach(async () => {
    mockSupabaseAuth = {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      admin: { createUser: jest.fn() },
    };
    // Configurar ANTES de compilar o módulo (o constructor chama createClient)
    (createClient as jest.Mock).mockReturnValue({ auth: mockSupabaseAuth });

    const module = await Test.createTestingModule({ ... }).compile();
    // ...
  });

  it('...', async () => {
    mockSupabaseAuth.getUser.mockResolvedValue({
      data: { user: { id: 'uid' } },
      error: null,
    });
    // ...
  });
});
```

---

## Mock do ConfigService

```typescript
const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('fake-value'),
};
// Injetar via: { provide: ConfigService, useValue: mockConfigService }
```

---

## Datas determinísticas

Use fake timers em qualquer teste que use `new Date()` internamente:

```typescript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

---

## Convenções de nomenclatura

| Elemento | Padrão |
|---|---|
| Describe externo | Nome da classe: `PlansService` |
| Describe interno | Nome do método: `'findAll'`, `'create'` |
| It — caminho feliz | Verbo presente: `'retorna planos da academia'` |
| It — erro | `'lança NotFoundException quando...'` |
| It — efeito colateral | `'não chama update quando...'` |

---

## O que testar obrigatoriamente

Para cada método público de um service:

1. **Caminho feliz** — retorno correto com dados válidos
2. **Exceção de negócio** — NotFoundException / BadRequestException quando aplicável
3. **Mensagem da exceção** — o texto deve ser específico (ex: `'Plano não encontrado'`)
4. **Efeitos colaterais importantes** — ex: `createMany` chamado após `create`, `update` NÃO chamado quando recurso inexistente

Para lógica de cálculo (dashboard, status financeiro):
- Teste os casos-limite: valor nulo → 0, divisão por zero → 0%

---

## O que NÃO testar

- Módulos (`.module.ts`)
- DTOs — validação é responsabilidade do `ValidationPipe`, não do service
- Controllers — testados em E2E
- `PrismaService` — é uma extensão do PrismaClient
- `AppService` — trivial

---

## Cobertura mínima

| Métrica | Mínimo |
|---|---|
| Statements | 80% |
| Branches | 70% |
| Functions | 80% |
| Lines | 80% |

Coletado somente de `**/*.service.ts` e `**/*.guard.ts` (exceto `app.service.ts` e `prisma.service.ts`).

---

## Configuração do ambiente de testes

### Por que `src/__mocks__/prisma-client.ts` existe

O Prisma v7 gera um cliente em `prisma/generated/prisma/client.ts` que usa `import.meta.url` (sintaxe ESM). Jest roda em CommonJS por padrão e não consegue parsear esse arquivo.

A solução é o `moduleNameMapper` no `package.json`:

```json
"moduleNameMapper": {
  "prisma/generated/prisma/client": "<rootDir>/__mocks__/prisma-client.ts"
}
```

O arquivo `src/__mocks__/prisma-client.ts` fornece um `PrismaClient` mínimo apenas para satisfazer os imports. Os testes nunca instanciam o `PrismaService` real — usam sempre `useValue: mockPrisma`.

**Não remova este arquivo sem entender esse contexto.**

---

## Comandos

```bash
# Rodar todos os testes
npm run test

# Modo watch (desenvolvimento)
npm run test:watch

# Relatório de cobertura (falha se abaixo do threshold)
npm run test:cov
```

A cobertura falha o build automaticamente se ficar abaixo dos thresholds — isso é intencional para CI.
