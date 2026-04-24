# Ledger DS

Design system do GymLedger. Direção visual: **Editorial Fintech** — clareza, whitespace, dados em primeiro plano, cor usada com parcimônia em estados e status.

## Princípios

- **Clareza > decoração** — cada elemento tem função, não ornamento
- **Dados em primeiro plano** — tipografia forte, hierarquia de informação clara
- **Confiança financeira** — paleta navy/verde/âmbar comunica precisão e controle
- **Acessibilidade embutida** — componentes Radix garantem comportamento correto sem esforço
- **Tokens como contrato** — mudar um token muda todo o produto consistentemente

## Como usar tokens

Todos os tokens são variáveis CSS disponíveis globalmente após importar `tokens/index.css`.

```tsx
// Use var() em Tailwind arbitrary values
<div className="bg-[var(--color-accent)] rounded-[var(--radius-xl)]" />

// Ou inline styles
<div style={{ color: 'var(--color-text-muted)' }} />
```

**Tokens semânticos** (use esses, não os primitivos):
- Cor: `--color-accent`, `--color-surface`, `--color-text-primary`, `--color-text-muted`, `--color-border`, `--color-danger`, `--color-warning`
- Tipografia: `--font-display` (Space Grotesk), `--font-body` (Manrope)
- Tamanhos de texto: `--text-xs` → `--text-4xl`
- Raios: `--radius-sm/md/lg/xl/full`
- Sombras: `--shadow-sm/md/lg`
- Motion: `--duration-fast/base/slow`, `--ease-out`

## Componentes disponíveis

### Primitivos
| Componente | Descrição |
|---|---|
| `Button` | Ação principal. Variantes: `primary / secondary / ghost / danger`. Prop `asChild` para polimorfismo. |
| `Badge` | Label semântico. Variantes: `neutral / success / warning / danger / info`. |
| `StatusBadge` | Badge de domínio. Status: `paid / late / canceled / pending / active / inactive`. |
| `Card` | Container. Variantes: `elevated / flat / tinted / emerald / blue / amber / slate / dark`. Sub-componentes: `Header / Body / Footer`. |
| `Input` | Campo de texto com label, helper text, erro, ícones. |
| `Textarea` | Área de texto com label, helper text, erro. |
| `Checkbox` | Radix Checkbox com label. |
| `Switch` | Radix Switch com label. |
| `Select` | Radix Select com label, opções, erro. |
| `Tooltip` | Radix Tooltip com `content` e `side`. |
| `Dialog` | Radix Dialog. Sub-componentes: `Trigger / Content / Header / Footer / Title / Description / Close`. |
| `Dropdown` | Radix DropdownMenu. Sub-componentes: `Trigger / Content / Item / Label / Separator`. |
| `Toast` | Radix Toast. Variantes: `default / success / warning / danger / info`. Requer `Toast.Provider`. |
| `Table` | Tabela semântica com densidade. Sub-componentes: `Head / Body / Row / HeaderCell / Cell / Empty`. |

### Patterns (domínio GymLedger)
| Pattern | Descrição |
|---|---|
| `MetricCard` | Card de KPI com título, valor, delta e tendência. |
| `PaymentRow` | Linha de pagamento com StatusBadge integrado. |
| `SidebarNav` | Navegação lateral com ícones Lucide e badge numérico. |

## Como criar um novo primitivo

```
src/design-system/primitives/MeuComponente/
  MeuComponente.tsx        # componente + forwardRef
  MeuComponente.variants.ts  # cva() para variantes (se necessário)
  MeuComponente.test.tsx   # Vitest + @testing-library/react (≥85% coverage)
  index.ts                 # export { MeuComponente } from './MeuComponente'
```

1. Use `cn()` de `../../utils/cn` para composição de classes
2. Use `var(--token)` em arbitrary values do Tailwind: `bg-[var(--color-accent)]`
3. Para gradientes, use `[background:linear-gradient(...)]`
4. Adicione o export no barrel `primitives/index.ts`
5. Documente no showcase `pages/DesignSystemShowcase.tsx`

## Catálogo visual

Execute `npm run dev` e acesse `/ds`.
