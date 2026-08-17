# Spartan repo instructions for AI contributors

This file is the repo-specific contract. If anything conflicts with global/personal instructions, this file wins.

## External reference (AI Elements)
- Canonical behavior/spec reference: https://elements.ai-sdk.dev
- Component reference example: https://elements.ai-sdk.dev/components/attachments
- For AI Elements work, React docs/examples are the parity source; implement Angular equivalents in Spartan.

## Composition-first rule (non-negotiable)
- Build larger patterns by composing existing Spartan primitives first (helm/registry components, variants, wrappers, tokens).
- Do not introduce bespoke structure/styles when an equivalent system pattern already exists.
- Do not hardcode visual values (color, spacing, radius, typography) when semantic tokens exist.

## If component mapping is unclear
- Call out uncertainty explicitly.
- Propose the closest existing primitives/variants first.
- Do not create a new primitive/variant without justification.
- If divergence from React reference is required, document: what differs, why, and UX impact.

## Theming and cascade guardrails (critical)
- Keep PDP light tokens on `:root.style-pdp` (not plain `.style-pdp`) to out-specify default `:root` tokens.
- Keep dark overrides on `.style-pdp.dark`.
- Do not attach `style-pdp` directly to `<body>` bootstrap scripts; theme switching is controlled on `<html>`.
- Keep placeholder and muted hierarchy separate (`--pdp-placeholder` vs `--muted-foreground`).

## UI quality bar
- Preserve state coverage for changed UI: default, hover, active, focus-visible, disabled, invalid.
- Validate light and dark mode parity for visual changes.
- Prefer semantic token updates over per-component one-off overrides.

## Definition of Done (required)
- React AI Elements parity checked for behavior/structure/states on impacted components.
- Light and dark mode behavior verified for changed UI.
- Interactive state coverage verified: default, hover, active, focus-visible, disabled, invalid.
- Required repo checks completed for the scope of change.
- Diff is scoped to requested work with no unrelated file drift.

## Delivery and release control
- Never commit unless explicitly instructed: "commit".
- Never push unless explicitly instructed: "push".
- Never create a PR unless explicitly instructed: "create PR".
- Default is local, review-ready working changes only.

## Remote target (critical — always the fork, never upstream)
- All work in this repo happens against the `fork` remote (`dowsprogress/spartan`), never
  `origin` (`spartan-ng/spartan`, the upstream project repo).
- "push", "merge", "merge to fork/main", and PR instructions always mean the `fork` remote
  and its branches, unless explicitly told otherwise.
- Never push, merge into, or open a PR against `origin`/upstream without explicit instruction.
- When in doubt, confirm with `git remote -v` before any push/merge and target `fork`.

## Required checks before completion
- `pnpm run lint`
- `pnpm nx format:write`
- `pnpm nx format:check --base=origin/main`
- Targeted tests where relevant (or `pnpm run test` when needed)
- Targeted build where relevant (or `pnpm run build` when needed)
- Storybook/theme work: `pnpm nx run ui-storybook:build-storybook`

## Commit/PR conventions
- Follow Conventional Commits and repo commitlint rules from `CONTRIBUTING.md` and `commitlint.config.cjs`.
- Use valid scopes only; omit scope if no valid scope applies.
- Fill `.github/PULL_REQUEST_TEMPLATE.md` completely when creating PRs.
