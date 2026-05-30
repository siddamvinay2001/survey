---
description: Open a PR for the current branch, linked to an issue, with validated commit messages.
argument-hint: "[#issue-number]"
allowed-tools: Bash(gh:*), Bash(git:*), Read
---

Open a pull request for the current branch.

## Preflight

1. Verify `gh` is installed and authenticated; abort with install instructions if not.
2. Confirm the current branch is **not** `main`. If it is, abort and tell the user to create a feature branch first.
3. Parse `$ARGUMENTS` for an issue number (`#123` or `123`). If missing, ask the user which issue this PR closes. If genuinely no issue exists, ask whether to create one first via `/issue` — do not open a PR without an issue link.

## Determine branch type from issue

Look up the issue with `gh issue view <N>` and read its labels or title to decide the branch prefix:
- Bug / fix → `fix/`
- Feature / enhancement → `feat/`
- Docs → `docs/`
- Chore / dependency / config → `chore/`
- Refactor → `refactor/`
- CI / workflow → `ci/`

Derive a short kebab-case slug from the issue title (≤ 40 chars). Branch name format: `<prefix>/issue-<N>-<slug>` (e.g. `fix/issue-13-semantic-output-element`).

### Branch handling (in order)

1. **Already on the correct branch** (name matches `<prefix>/issue-<N>-*`): do nothing, continue.
2. **On an old/unrelated branch** (any branch that is not `main` and does not match the expected pattern):
   a. Stash any uncommitted changes: `git stash push -m "pr-skill: auto-stash for branch switch"`.
   b. Fetch and sync main: `git fetch origin main && git checkout main && git pull origin main`.
   c. Create the new branch from the updated main: `git checkout -b <new-branch>`.
   d. Pop the stash: `git stash pop`. If the pop produces conflicts, stop and tell the user to resolve them before continuing.
   e. Tell the user: "You were on `<old-branch>`. I've created `<new-branch>` off the latest main and moved your changes there."
3. **On main**: abort and tell the user to use a feature branch.

## Stage and commit changes

1. Run `git status --short` to discover modified and untracked files.
2. Identify which files are relevant to the issue (do NOT stage unrelated files or the `.claude/` directory).
3. Stage only the relevant files: `git add <file1> <file2> ...`
4. Commit with a conventional commit message: `<type>(<scope>): <subject> (#<N>)` where:
   - `type` matches the branch prefix type (`fix`, `feat`, `docs`, etc.)
   - `scope` is the package/area changed (e.g. `web`, `sdk`, `anchor`, `ui`)
   - `subject` is ≤ 72 chars total for the full subject line
5. Show the user which files were staged and the commit message before committing. If the user objects, abort.

## Commit message validation

Run `git log main..HEAD --pretty=format:"%h %s"`. Every commit subject must:

1. Match conventional commits: `<type>(<scope>): <subject>` where type ∈ `feat|fix|docs|chore|refactor|test|perf|build|ci|style`.
2. End with ` (#<N>)` matching the issue number (or be a `chore:` merge/rebase commit).
3. Be ≤ 72 chars.

If any commit fails validation, list the offending commits and ask the user whether to:
- Rewrite them with `git rebase -i` (the user runs this — do not run interactive rebase yourself), or
- Proceed anyway (note the violation in the PR body).

## PR title & body

Title: take the most recent semantically meaningful commit subject (or synthesize from the diff if commits are noisy). Keep ≤ 70 chars. Include the issue number suffix: `feat(web): add survey creation form (#42)`.

Body template:

```markdown
## Summary
- <bullet 1 — what changed and why>
- <bullet 2>
- <bullet 3 if needed>

Closes #<N>

## Changes
<short prose or bullets describing the diff at a high level — group by package>

## On-chain impact
<only if packages/anchor/ changed: account size delta, rent cost estimate, IDL changes; otherwise: "None.">

## Security
<reference CLAUDE.md §4 items touched, or "No security-sensitive changes.">

## Test plan
- [ ] <how reviewers can verify>
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] (if anchor changed) `pnpm anchor:test`
- [ ] (if web UI changed) ran `/design-check`

## Screenshots
<only for UI changes; otherwise drop this section>
```

## Create the PR

1. Push branch with `git push -u origin <branch>`.
2. `gh pr create --title "<title>" --body "<body>" --base main` (HEREDOC the body for formatting).
3. Print the PR URL.

Do not request reviewers automatically — the `.github/workflows/claude-review.yml` action will run on open. Suggest the user invoke the `pr-reviewer` subagent locally first if the diff is large.
