# Supabase Postgres Setup

Este guia registra a configuracao esperada para o banco do GymLedger no MVP.

## Decisao

- Banco: Supabase Postgres.
- Multi-tenant MVP: `gymId` nas entidades de negocio.
- ORM: Prisma.
- Auth: Supabase Auth.
- Storage futuro: Supabase Storage.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
PORT=4000
NODE_ENV=development

DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## URLs do banco no Supabase

Use duas URLs:

- `DATABASE_URL`: connection string de runtime, preferencialmente com pooling.
- `DIRECT_URL`: connection string direta, usada por migrations do Prisma.

No Supabase, esses valores ficam nas configuracoes do projeto em database connection string.

## Regras de seguranca

- Nunca commitar `.env` ou `.env.local`.
- Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no frontend.
- Backend pode usar `SUPABASE_SERVICE_ROLE_KEY` apenas em operacoes server-side.
- Todas as queries de entidades de negocio devem filtrar por `gymId`.
- RLS deve ser preparada antes de expor acesso direto do frontend ao banco.

## Checklist de criacao do projeto Supabase

- [ ] Criar projeto Supabase.
- [ ] Copiar `SUPABASE_URL`.
- [ ] Copiar `SUPABASE_ANON_KEY`.
- [ ] Copiar `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Copiar connection string pooled para `DATABASE_URL`.
- [ ] Copiar connection string direta para `DIRECT_URL`.
- [ ] Rodar migrations do Prisma.
- [ ] Rodar seed inicial.
- [ ] Validar `/health`.

