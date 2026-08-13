# Skill: Nx validation gates

## Purpose
Keep changes review-ready and CI-safe with the repo's expected checks.

## Standard checks
1. `pnpm run lint`
2. `pnpm nx format:write`
3. `pnpm nx format:check --base=origin/main`
4. Targeted tests for changed behavior (or `pnpm run test` when needed)
5. Targeted build for changed area (or `pnpm run build` when needed)

## Storybook/theme changes
- Always run: `pnpm nx run ui-storybook:build-storybook`

## Execution rules
- Use the smallest targeted command set that validates changed behavior.
- If unrelated file drift appears (e.g., formatter touching unrelated files), revert unrelated changes.
- Do not consider task complete until required checks for scope are green.
