---
description: Draft and file a GitHub issue (bug / feature / improvement / chore) for this repo.
argument-hint: "<short description of the issue>"
allowed-tools: Bash(gh:*), Bash(git remote:*), Bash(git log:*), Read
---

Create a well-formed GitHub issue from `$ARGUMENTS`.

## Preflight

1. Verify `gh` is installed (`which gh`). If not, tell the user to `brew install gh && gh auth login` and stop.
2. Verify `gh auth status` succeeds. If not, tell the user to run `gh auth login` and stop.
3. Read the remote (`git remote get-url origin`) to confirm the target repo.

## Drafting rules

Classify the issue as exactly one of: `bug`, `feature`, `improvement`, `chore`, `docs`.

**Title format:** `<type>: <imperative summary>` — under 70 chars. Examples:
- `bug: wallet disconnect drops in-flight stake tx`
- `feature: add slash instruction to anchor program`
- `improvement: cache validator scoring per ValidatorRun`

**Body template** (use markdown, fill what applies, drop sections that don't):

```markdown
## Context
<why this matters — link to docs/architecture.md or docs/threat-model.md section if relevant>

## Proposed change
<what should happen, concretely>

## Acceptance criteria
- [ ] <testable outcome 1>
- [ ] <testable outcome 2>

## Notes
<edge cases, security considerations per CLAUDE.md §4, on-chain vs off-chain placement per §2>
```

For a **bug**, replace `Proposed change` with:
```markdown
## Steps to reproduce
1. ...

## Expected
...

## Actual
...
```

## Labels

Apply labels matching the type (`bug`, `feature`, `improvement`, `chore`, `docs`). If the labels don't exist on the repo, create them with `gh label create` using sensible colors (bug=#d73a4a, feature=#0e8a16, improvement=#1d76db, chore=#cccccc, docs=#0075ca).

If the change touches:
- `packages/anchor/` → add label `area:anchor`
- `apps/web/` → add label `area:web`
- `packages/db/` → add label `area:db`
- `packages/validation/` → add label `area:validation`

Create area labels on demand the same way (color `#bfd4f2`).

## Confirmation

Print the drafted title, body, and labels. Ask the user to confirm before filing. On confirmation, run:

```
gh issue create --title "<title>" --body "<body>" --label "<csv>"
```

Print the resulting issue URL and number. Suggest the user reference `#<N>` in subsequent commits.
