# cli-smoke

Smoke tests that verify the spartan CLI against every supported workspace **setup**, by scaffolding
real workspaces, running the generators, consuming a generated component, and building the result.
This catches the class of bug that the in-memory generator unit tests cannot: broken tsconfig path
mapping, missing dependencies, generated code that does not compile or is not consumable through its
public alias, secondary-entrypoint wiring, and theme styles that never reach the build output.

They are smoke tests, not full end-to-end tests: they assert the output **compiles, is consumable,
and builds with themed styles**, but they do not run the app or assert runtime behaviour.

## What it does

1. **global-setup** starts a local [verdaccio](https://verdaccio.org/) registry (the `local-registry`
   target on the root `spartan` project), then builds and publishes `@spartan-ng/cli` and
   `@spartan-ng/brain` to it under a forced version (`9999.0.0-smoke.<timestamp>` - unique per run so
   pnpm's cache can't serve a stale build). They share a version because the CLI writes the
   `@spartan-ng/brain` dependency at the installed CLI version.
2. For each cell in [`src/matrix.ts`](./src/matrix.ts) it scaffolds a fresh workspace (in the OS temp
   dir, not the repo), pins Tailwind v4 via the documented `.postcssrc.json` setup, installs the
   locally published CLI, writes `components.json`, runs `init` + `ui <component>`, asserts the CLI's
   own `healthcheck` reports no issues on the generated output, drops in a probe component that
   **uses** the generated code through the `@spartan-ng/helm/*` alias, then builds and asserts the theme
   CSS variables reached the output. A generator error, a healthcheck failure, a non-zero build, or
   missing themed CSS fails the cell.
3. **global-teardown** stops the registry.

## The matrix

- `nx` monorepo x {`library`, `entrypoint`} x {`buildable`, `non-buildable`}
- `nx-standalone` - single-app nx workspace with no `tsconfig.base.json`
- `acli` - Angular CLI, no Nx
- `all-components` - generates **every** supported primitive into an Angular CLI app and builds them all
  in one `ng build`; the slowest cell, but fans out to its own runner. Set `nightlyOnly: true` in
  `src/matrix.ts` to drop it from per-PR CI if it proves too slow.
- `style-acli-<style>` / `style-nx-<style>` - one cell per supported **style**, split across angular-cli
  and nx so both generator paths are exercised: `nova`/`maia`/`luma` on angular-cli, `lyra`/`mira` on nx
  (`vega` is the default the other cells already use). Each generates with that style and asserts the CLI
  replaced the `spartan-*` placeholders with **that style's** registry classes - no leftover
  non-allowlisted placeholders, and at least one class unique to the style (derived from
  `libs/registry/src/styles`, never hardcoded) reaches the output. The standard build's themed-CSS check is
  style-blind (those vars come from the `--theme`, not the style), so these cells are the only coverage that
  the per-style class replacement works.

Tailwind is fixed at v4. Add or remove combinations in `src/matrix.ts`. When a style is added to or removed
from `libs/registry/src/styles/style.ts`, update the `styleCells` list in `src/matrix.ts` (and the matching
`style-*` entries in `.github/workflows/cli-smoke.yml`).

## Running

```bash
# full matrix (also: `pnpm smoke`)
pnpm nx run cli-smoke:smoke

# a single cell (jest matches the whole test name, so use a substring, not an anchored id)
pnpm nx run cli-smoke:smoke --testNamePattern="nx-lib-buildable scaffolds"
```

Each cell installs dependencies and runs a real Angular build, so it is slow; locally the cells run
single-threaded (one shared local registry). On failure the scaffolded workspace is left under
`<os-tmp>/spartan-cli-smoke-workspaces/<cell-id>` for inspection; on success it is removed.

## CI

- **`.github/workflows/cli-smoke.yml`** runs the matrix, fanning **each cell out to its own runner** so
  they run in parallel from the start - wall-clock is roughly the slowest single cell, not the sum.
  - It runs on **every** push/PR (no path filter) so the `cli-smoke result` job can be a **required
    check** that never sits pending. Cheapness on unrelated PRs comes in two layers: (1) a `git diff`
    gate before `pnpm install` skips the job in seconds when nothing CLI-relevant changed; (2) when it
    does install, the in-runner `isSmokeAffected()` check (`src/support/affected.ts`) makes the precise
    nx-affected call and still short-circuits to a pass if cli-smoke isn't actually affected.
    `nrwl/nx-set-shas` provides the base/head both layers use.
  - A fast `drift-guard` job fails CI if `matrix.ts` grows a cell the workflow's static matrix doesn't
    list (keep the two in sync).
  - `cli-smoke result` aggregates the matrix + drift-guard into one status to require in branch
    protection.
- **nightly-release.yml** runs the full matrix unconditionally every night (single job; no base/head,
  so the affected check always runs it).
