---
name: project-stack
description: Key stack facts for the survey platform UI — hugeicons usage pattern, exports, icon typing
metadata:
  type: project
---

Stack: Next.js 16, React 19, Tailwind v4, shadcn/ui via `@survey/ui` workspace package.

`@hugeicons/react` exports only `HugeiconsIcon` component (and `IconSvgElement` type). Icons are SVG data arrays from `@hugeicons/core-free-icons` and must always be passed via `<HugeiconsIcon icon={SomeIcon} />` — they are NOT React components and cannot be used as JSX directly.

Type icons with `import { type IconSvgElement } from '@hugeicons/react'` — do not use `any`.

Named exports only for components. `export default` is only for Next.js page files (App Router requirement).

New shadcn primitives: `pnpm dlx shadcn@latest add <name> --cwd packages/ui`. They land in `packages/ui/src/components/` and auto-export via `"./components/*"` in package.json.

**Why:** `@hugeicons/core-free-icons` exports SVG data, not React components. `@hugeicons/react` provides the renderer.

**How to apply:** Always wrap hugeicons in `<HugeiconsIcon icon={...} />`. Never `<SomeIcon />` directly.
