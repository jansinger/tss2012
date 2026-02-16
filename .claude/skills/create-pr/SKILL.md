---
name: create-pr
description: 'Creates well-structured pull requests by analyzing all commits on the branch'
disable-model-invocation: true
allowed-tools: 'Read, Bash'
---

# Create Pull Request

Invoked with: `/create-pr [base-branch]`

Default base branch: `main`

## Step 1: Analyze Current Branch

```bash
git status
git log --oneline main..HEAD
git diff main...HEAD --stat
```

Extract: branch name, all commits since branching, files changed, lines added/removed.

## Step 2: Analyze ALL Commits

For EACH commit on the branch (not just the latest):

```bash
git log main..HEAD --format="%H %s"
```

Build a complete understanding:

- What features were added?
- What bugs were fixed?
- What was refactored?
- Were tests added?
- Was documentation updated?

## Step 3: Generate PR Title

Format: `<type>: <concise description>`

| Type       | Use for                                 |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `refactor` | Code restructuring (no behavior change) |
| `docs`     | Documentation only                      |
| `test`     | Test additions/updates                  |
| `chore`    | Maintenance (deps, config)              |
| `perf`     | Performance improvement                 |

Rules:

- Max 70 characters
- Imperative mood ("add" not "added")
- Lowercase (except proper nouns)
- No period at end

## Step 4: Generate PR Body

```markdown
## Summary

<2-3 bullet points covering ALL changes in the branch>

## Changes

<List of files with brief descriptions grouped by category>

## Test Plan

- [ ] Manual testing: <specific steps>
- [ ] Unit tests pass: `npm run test`
- [ ] Type check passes: `npm run check`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build-ci`

## Breaking Changes

<List breaking changes, or "None">

## Related Issues

Fixes #<number> / Relates to #<number>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Step 5: Push and Create PR

```bash
# Push branch if needed
git push -u origin $(git branch --show-current)

# Create PR
gh pr create \
  --base main \
  --title "<generated-title>" \
  --body "$(cat <<'EOF'
<generated-body>
EOF
)"
```

## Step 6: Display Result

Show the PR URL to the user.

## Quality Checks Before PR

- [ ] Branch is up to date with base (`git pull --rebase origin main`)
- [ ] All commits have meaningful messages
- [ ] Tests pass locally
- [ ] No WIP or fixup commits (squash if needed)
