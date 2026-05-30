---
description: Audit the current diff (or named files) against the frontend design guidelines.
argument-hint: "[optional file paths]"
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(rg:*), Read, Grep, Glob
---

Audit UI changes against `.claude/design-guidelines.md`.

## Scope

- If `$ARGUMENTS` is non-empty, treat it as a space-separated list of file paths to audit.
- Otherwise, audit the current branch's working-tree diff vs `main` (staged + unstaged) limited to:
  - `apps/web/**/*.{tsx,ts,css}`
  - `packages/ui/**/*.{tsx,ts,css}`

Use `git diff --name-only main...HEAD` plus `git status --short` to enumerate changed files.

## Procedure

1. Read `.claude/design-guidelines.md` first — it is the source of truth, not your memory.
2. For each file in scope, read the changed regions and check against the rules in §1–6 of the guidelines.
3. Run targeted greps to catch the anti-patterns in §6 across the changed files only (don't scan the whole repo):
   - Arbitrary Tailwind values: `\[[0-9]+px\]|\[#[0-9a-fA-F]{3,8}\]`
   - Hex literals: `#[0-9a-fA-F]{3,8}\b` in `.tsx`/`.css`
   - Inline styles: `style=\{\{`
   - Default exports of components: `^export default function [A-Z]`
   - Direct palette colors: `\b(bg|text|border)-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+\b`

## Output

Report in this exact format. No preamble.

```
DESIGN CHECK — <N> file(s) audited

VIOLATIONS
  <file>:<line>  <rule §X.Y>  <one-line description>
  ...

WARNINGS  (style choices worth a second look, not strict violations)
  <file>:<line>  <note>
  ...

OK  (files audited with no findings)
  <file>
  ...
```

If there are zero violations and zero warnings, end with `All clear.` and skip the empty sections.

Do not modify any files. Do not propose fixes inline — the user will run `/simplify` or ask for fixes explicitly.
