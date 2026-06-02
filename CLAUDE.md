# Working in this repo (notes for Claude / AI agents)

Conventions for this nx workspace, written to avoid the common CI failures.

## Before pushing: run the CI checks locally

CI (`.github/workflows/ci.yml`) runs the steps below. Run them locally first so a push does not
bounce on something that was avoidable:

- `pnpm run lint`
- `pnpm nx format:write` then `pnpm nx format:check --base=origin/main` - the `format-and-lint`
  job fails on any unformatted file; `format:write` fixes them. Run this AFTER any code change,
  including ones a linter/formatter made, and re-check before committing.
- `pnpm run test`
- `pnpm run build`

## Commit messages (Conventional Commits, enforced by commitlint with `failOnWarnings`)

See `commitlint.config.cjs` and `CONTRIBUTING.md`.

- Format: `<type>(<scope>): <subject>` - the scope is OPTIONAL.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`.
- If you include a scope it MUST be one of the `scope-enum` values (the component names plus
  `cli`, `nx`, `repo`, `trpc`, `typography`). NOTE: `app` is NOT a valid scope - omit the scope
  for docs-app changes rather than inventing one.
- A blank line is required between the subject and the body, and before the footer.
- No line in the message may exceed 100 characters.
- Do NOT add a `Co-Authored-By` (or any AI) trailer.

## Pull requests

- Always populate `.github/PULL_REQUEST_TEMPLATE.md`: tick the checklist, the PR type, the affected
  package(s), and fill "current behavior" / "new behavior" / breaking-change. Create with
  `gh pr create --body-file <filled-template-file>`.
