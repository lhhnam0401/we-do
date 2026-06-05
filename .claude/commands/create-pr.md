---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git branch:*), Bash(git log:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git rebase:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh auth status:*)
description: Stage, commit, push, and open a GitHub pull request from current changes
---

## Context

- Git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`

## Your task

Follow the push-pr skill workflow:

1. Check if on `main`/`master` — if so, create a feature branch first
2. Stage specific changed files (never `git add .`)
3. Commit with a concise imperative message + co-author trailer
4. Push with `git push -u origin <branch>`
5. Run `gh pr create --base main` with a short title and summary body
6. Return the PR URL

Do all steps in as few messages as possible. Do not ask for confirmation unless there are conflicts or sensitive files.
