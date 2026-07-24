# CLI reference (`@spartan-ng/cli`)

The CLI is an Nx plugin that also runs as Angular CLI schematics. Pick the invocation that matches
the workspace (`info --json` reports `workspaceType`):

- **Nx** (`nx.json` present): `npx nx g @spartan-ng/cli:<generator>` (or `pnpm nx g ...`).
- **Angular CLI** (`angular.json`, no `nx.json`): `ng g @spartan-ng/cli:<generator>`.

Install the plugin first: `npm i -D @spartan-ng/cli`.

## Core generators

### `init`

One-time setup. Installs the required dependencies and runs the theme generator (Tailwind + the
spartan preset and CSS variables).

```bash
npx nx g @spartan-ng/cli:init
ng g @spartan-ng/cli:init
```

`components.json` is not written by `init`; it is created on the first `ui` run, which prompts for
the components path (e.g. `libs/ui`), the import alias (default `@spartan-ng/helm`), and on Nx
whether libraries are buildable and the `generateAs` strategy.

### `ui`

Adds components. Installs the Brain dependency from npm and copies the Helm code into
`componentsPath`. Run with no name for an interactive multiselect, or target one component:

```bash
npx nx g @spartan-ng/cli:ui                 # interactive multiselect (choose 'all' or specific)
npx nx g @spartan-ng/cli:ui --name=dialog   # add a single component
ng g @spartan-ng/cli:ui --name=button
```

Dependent components are pulled in automatically.

### `ui-theme`

Generates the CSS theme variables (light + dark) into your stylesheet.

```bash
npx nx g @spartan-ng/cli:ui-theme
ng g @spartan-ng/cli:ui-theme
```

### `info`

Read-only. Prints project context. Add `--json` for machine-readable output (use this for agents).

```bash
npx nx g @spartan-ng/cli:info --json
ng g @spartan-ng/cli:info --json
```

Fields: `workspaceType`, `config` (`componentsPath`, `importAlias`, `buildable`, `generateAs`),
`versions`, `iconLibrary`, `tailwindCssFile`, `installedComponents`, `availableComponents`.

### `healthcheck`

Scans the workspace for deprecated APIs, outdated imports, and breaking changes; can auto-fix.

```bash
npx nx g @spartan-ng/cli:healthcheck            # report only
npx nx g @spartan-ng/cli:healthcheck --autoFix  # apply fixes
ng g @spartan-ng/cli:healthcheck --autoFix
```

Run it after upgrading `@spartan-ng` packages.

## Migration generators

The `migrate-*` family upgrades specific components/APIs (e.g. `migrate-brain-imports`,
`migrate-helm-imports`, `migrate-module-imports`, `migrate-naming-conventions`, `migrate-select`,
`migrate-icon`, and more - see `generators.json` for the full list). In normal use you do not invoke
these directly - run `healthcheck`, which scans for the same problems and applies the fixes
automatically. Invoke a single migration only when targeting a specific upgrade:

```bash
npx nx g @spartan-ng/cli:migrate-helm-imports
```

## Typical sequence

```bash
npm i -D @spartan-ng/cli
npx nx g @spartan-ng/cli:init
npx nx g @spartan-ng/cli:ui-theme
npx nx g @spartan-ng/cli:ui --name=button
```
