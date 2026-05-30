# Frontend design guidelines

Single source of truth for UI consistency in this repo. The `ui-frontend-builder` agent, `/design-check` skill, and `pr-reviewer` subagent all enforce these. Update this file when a rule changes — don't fork the rules into prompts or agent bodies.

Stack: Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui (via `@survey/ui`).

---

## 1. Components

- **Use shadcn primitives from `@survey/ui` first.** If something doesn't exist there, add it to `packages/ui/src/components/` and re-export. Don't build a one-off in `apps/web/components/`.
- **No inline UI primitives.** Don't define a `Button`, `Card`, `Input`, `Dialog`, etc. inside an app page or feature folder. Promote it to `@survey/ui`.
- **Compose, don't fork.** Need a variant? Extend via `cva` variants on the existing component, not a copy.
- **Named exports only.** No `export default` for React components.
- **Icons:** use `@hugeicons/react`. Don't mix icon libraries.
- **Adding a new shadcn primitive:** `pnpm dlx shadcn@latest add <component-name> --cwd packages/ui`. Never copy shadcn source manually or use `npx shadcn-ui`.

## 2. Colors

- **Only semantic tokens.** Use `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`, etc. — the shadcn token set defined in `packages/ui/src/styles/`.
- **No hex literals in JSX/CSS** (`#fff`, `#1a1a1a`, `rgb(...)`). If you need a new color, add it as a token in the global stylesheet first.
- **No Tailwind palette colors directly** (`bg-blue-500`, `text-red-600`). Map through a semantic token (`bg-destructive`, `text-primary`).
- Dark mode is theme-token-driven via `next-themes`. Never `dark:bg-[#xxx]` — that defeats the token system.

## 3. Typography

- **Font sizes from the Tailwind scale only:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`. No `text-[15px]` arbitrary values.
- **Font weights from the scale:** `font-normal`, `font-medium`, `font-semibold`, `font-bold`. No `font-[550]`.
- **Headings use semantic HTML** (`<h1>` … `<h6>`). Style via classes; don't render an `<h2>` as a `<div>`.
- One font family per surface. Don't import additional fonts without adding them to the root layout.

## 4. Spacing & layout

- **Spacing scale only:** Tailwind's `0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24` (etc.). No `p-[13px]`, `mt-[7px]`, `gap-[5px]`.
- **Page container:** wrap top-level page content in a `max-w-*` container with horizontal padding (`px-4 sm:px-6 lg:px-8`). Don't let content stretch edge-to-edge on wide screens.
- **Grid/flex gaps:** prefer `gap-*` over margins for sibling spacing. Margins are for separating a child from its parent context, not from siblings.
- **Vertical rhythm:** sections separated by `space-y-6` or `space-y-8`. Don't mix `mt-4`, `mb-7`, `mt-12` ad hoc within one stack.
- **Breakpoints:** mobile-first. Default styles target mobile, then `sm:`, `md:`, `lg:`, `xl:`. Don't write `lg:` rules without a mobile baseline.

## 5. State & interaction

- Loading, empty, and error states are required for every data-driven view. A blank screen during fetch is a bug.
- Focus states must be visible (don't `outline-none` without a replacement `focus-visible:ring`).
- Hit targets ≥ 44×44 px on mobile.

## 6. Accessibility

- All interactive elements must be keyboard-navigable with appropriate ARIA labels/roles.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`, etc.) — not `<div>` for everything.
- Form elements must have an associated `<label>` or `aria-label`.
- Color is never the only means of conveying information.

## 7. TypeScript & code standards

- `strict: true` everywhere — no `any`, no implicit returns, full prop and return types.
- Import shared packages via workspace aliases (`@survey/ui`, `@survey/types`, `@survey/sdk`). Never use deep relative paths that cross package boundaries.
- UI components in `packages/ui/` must be client-safe. Never import `prisma`, the validator signer, or `server-only` into a UI component. Server logic belongs in `apps/web/server/` or Next.js Server Components / Route Handlers.
- No commented-out code. Delete it; git remembers.
- Comments explain *why* (a constraint, a workaround) — never *what* the code does.
- Split files that exceed ~300 lines. One file per exported public API.

## 8. Blockchain-aware UI

- Wallet connection state must be handled gracefully: show loading, disconnected, and error states.
- SOL amounts must be formatted consistently (lamports → SOL, correct decimal precision).
- Transaction status (pending, confirmed, failed) must be clearly communicated — never leave a user wondering if their transaction went through.
- Never show raw error objects. Map program error codes to human-readable messages.

## 9. Anti-patterns (auto-flag)

When `/design-check` or `pr-reviewer` scans a diff, treat these as violations to surface:

- `style={{ ... }}` inline styles in components (use Tailwind classes).
- `className="... text-[14px] ..."` or any `[...]` arbitrary value for color/spacing/typography.
- Hex/`rgb()` color literals in `.tsx`, `.css`, `.scss`.
- Default exports of React components.
- Inline definitions of `Button`, `Card`, `Input`, `Dialog`, `Modal`, `Select`, `Tabs`, `Tooltip` outside `packages/ui/`.
- Direct Tailwind palette colors (`bg-blue-*`, `text-red-*`, etc.) instead of semantic tokens.
- `outline-none` / `outline: none` without a focus-visible replacement.
- Importing icons from any library other than `@hugeicons/react`.

## 10. Workflow (for the ui-frontend-builder agent)

1. Read this file before writing any code.
2. Audit `packages/ui/` for reusable components; check `apps/web/app/` for existing page/layout patterns.
3. Plan the component tree — identify which existing components compose into the target UI before writing code.
4. Define prop interfaces before the component body.
5. Wire to design tokens: spacing, color, and typography scales from this file.
6. Self-review against §9 anti-patterns before outputting code.
7. Walk through keyboard navigation, loading, error, and empty states.
8. Confirm no server-only imports leaked into client components.

## 11. When in doubt

Ask: "Does this match a pattern already used in `packages/ui/` or `apps/web/app/(app)/`?" If no, raise it in the PR description before adding a new pattern. New patterns get added here first, then used.
