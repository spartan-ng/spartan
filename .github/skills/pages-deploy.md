# Skill: GitHub Pages deploy (storybook-pages)

## Purpose
Deploy Storybook to GitHub Pages using the repo workflow safely.

## Workflow facts
- Workflow file: `.github/workflows/storybook-pages.yml`
- Triggers:
  - push to `main`
  - `workflow_dispatch`
- Environment protection may block non-`main` deploys.

## Procedure
1. Ensure required branch changes are pushed.
2. Trigger deploy on allowed ref (`main` when protection requires it):
   - `gh workflow run storybook-pages --ref main`
3. Check run result:
   - `gh run view <run-id>`
4. If failed, inspect failing job + environment protection messages first.

## Common failure modes
- Deploy rejected because branch is not allowed for `github-pages` environment.
- Build success but deploy blocked by protection rules.

## Output
- Provide run URL and final status.
- Provide Pages URL when deployment succeeds.
