---
name: project-routes
description: App Router route layout — (app) group, NavBar, and the app/page.tsx conflict issue
metadata:
  type: project
---

The `(app)` route group (`apps/web/app/(app)/`) provides the shared NavBar via its layout.tsx. Routes: `/` (landing), `/surveys`, `/create`, `/dashboard`.

`app/page.tsx` and `app/(app)/page.tsx` both map to `/` — this is a Next.js routing conflict. The env cannot delete files, so `app/page.tsx` currently redirects to `/surveys` as a stopgap. `app/(app)/page.tsx` is the real landing page.

**Why:** Next.js App Router route groups don't add URL segments, so (app)/page.tsx == /. File deletion unavailable in agent environment means the conflict can't be cleanly resolved.

**How to apply:** When working on `/` route changes, prefer `app/(app)/page.tsx`. Flag the `app/page.tsx` stub as tech debt to delete manually. The typecheck passes; runtime conflict only shows at `next dev`/`next build`.
