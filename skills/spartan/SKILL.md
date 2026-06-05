---
name: spartan
description: >-
  Manages spartan/ui, the Angular UI library - adding, composing, fixing, debugging, and styling UI
  with the Brain (headless primitives) and Helm (styled) layers. Provides project context, component
  APIs, and usage examples. Applies when working with spartan/ui, @spartan-ng/brain, @spartan-ng/helm,
  the @spartan-ng/cli generators, or any Angular project with a components.json file. Also triggers
  for "spartan init", "add a spartan component", or "set up spartan/ui".
user-invocable: false
allowed-tools:
  - Bash(npx nx g @spartan-ng/cli:*)
  - Bash(pnpm nx g @spartan-ng/cli:*)
  - Bash(ng g @spartan-ng/cli:*)
---

# spartan/ui

spartan/ui is an Angular UI library. It uses a **two-layer architecture**:

- **Brain (`@spartan-ng/brain`)** - accessible, unstyled primitives (Angular directives/components),
  installed from npm. This is the behavior and accessibility layer.
- **Helm (`@spartan-ng/helm`)** - the styled layer (Tailwind + class-variance-authority). Helm code
  is **copied into the user's project** by the CLI so they own and can customize it.

You compose Helm directives/components onto host elements; Helm wires up the matching Brain
primitive under the hood. Always prefer existing components over hand-written markup.

All CLI commands run through the workspace's runner. Detect it from the project:

- **Nx workspace** (has `nx.json`): `npx nx g @spartan-ng/cli:<generator>` (or `pnpm nx g ...`).
- **Angular CLI workspace** (has `angular.json`, no `nx.json`): `ng g @spartan-ng/cli:<generator>`.

## Current project context

Before generating any code, gather the project context:

```bash
npx nx g @spartan-ng/cli:info --json     # Nx
ng g @spartan-ng/cli:info --json         # Angular CLI
```

This is read-only and prints JSON with:

- `workspaceType` - `nx` | `angular-cli` (decides which runner to use above).
- `config.componentsPath` - where Helm components are copied (e.g. `libs/ui`).
- `config.importAlias` - the import prefix for Helm, default `@spartan-ng/helm`.
- `config.generateAs` - `library` | `entrypoint` (Nx layout choice).
- `versions` - Angular, Angular CDK, Tailwind, `@spartan-ng/brain`, `@spartan-ng/cli`.
- `iconLibrary` - `@ng-icons` when present.
- `tailwindCssFile` - the global stylesheet that imports the preset.
- `installedComponents` - components already present (do not re-add these).
- `availableComponents` - everything the CLI can generate.

If `components.json` does not exist, the project is not set up yet - run `@spartan-ng/cli:init`
first (it installs dependencies and the theme). `components.json` itself is created when you add the
first component with `ui` (see `cli.md`).

## Principles

1. **Use existing components first.** Check `installedComponents`, then `availableComponents`. Find
   docs via the MCP server (`spartan_components_list` / `spartan_components_get`) or the live docs at
   `https://www.spartan.ng/components/<name>`. See `mcp.md`.
2. **Compose, do not reinvent.** Build dashboards, forms, and dialogs from existing Helm + Brain
   pieces rather than custom markup.
3. **Use built-in variants before custom styles.** Buttons, badges, alerts, etc. ship `variant` and
   `size` inputs - use them instead of overriding classes.
4. **Use semantic colors, never raw values.** `bg-primary text-primary-foreground`, not
   `bg-blue-500`. See `rules/styling.md`.

## Critical rules

Read the rule file before doing the related work:

- **`rules/styling.md`** - the `hlm()` util, semantic color tokens, layout-only classes,
  `gap-*` over `space-*`, `size-*`, dark mode, no manual z-index on overlays.
- **`rules/forms.md`** - compose forms with `hlmField` (label, control, error, description) and
  `hlmFieldSet` / `hlmFieldLegend` on native `<fieldset>`/`<legend>`; option sets (2-7 choices) use
  `hlm-toggle-group`.
- **`rules/composition.md`** - items belong inside their group; dialogs/sheets need a title;
  full Card composition; tabs triggers inside `hlm-tabs-list`; avatar always has a fallback;
  use `Alert`/`Empty`/`Skeleton`/`Badge`/`Separator`/`Spinner` instead of custom markup.
- **`rules/icons.md`** - icons are `<ng-icon hlm name="lucide...">`; register with `provideIcons`;
  no manual sizing classes inside components - use the `size` input.
- **`rules/brain-vs-helm.md`** - the two-layer model (one headless library, Brain, plus the styled
  Helm layer); when to reach for Brain directly vs Helm, and how composition works via directives.
- **`cli.md`** - every generator (`init`, `ui`, `ui-theme`, `healthcheck`, `info`, `migrate-*`),
  with Nx and Angular CLI invocations.
- **`registry.md`** - the Brain-npm + Helm-copy-in distribution model, `components.json`, and the
  fixed component catalog (the shipped CLI uses no remote or custom registry).
- **`customization.md`** - theming via the `hlm-tailwind-preset.css`, CSS variables, the `ui-theme`
  generator, and extending copied Helm components.
- **`mcp.md`** - using the `@spartan-ng/mcp` tools, resources, and prompts for discovery.

## Key patterns

```html
<!-- Buttons: use variant/size inputs, not custom classes -->
<button hlmBtn variant="destructive" size="lg">Delete</button>

<!-- Icon in a button: ng-icon + hlm, no sizing classes -->
<button hlmBtn size="icon" variant="ghost">
	<ng-icon hlm name="lucideTrash" size="sm" />
</button>

<!-- Loading state: compose a spinner, there is no isLoading input -->
<button hlmBtn [disabled]="loading()">
	@if (loading()) {
	<hlm-spinner />
	} Save
</button>

<!-- Layout: gap, not space-* ; size-* when width == height -->
<div class="flex items-center gap-2">
	<span hlmBadge variant="secondary">beta</span>
</div>
```

## Component selection

| Need                   | Component(s)                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Action / button        | `button` (`hlmBtn`), `button-group`                                                         |
| Text/number input      | `input`, `textarea`, `input-otp`, `input-group`, `native-select`                            |
| Choice input           | `select`, `combobox`, `autocomplete`, `radio-group`, `checkbox`, `switch`, `slider`         |
| Toggle 2-7 options     | `toggle-group`                                                                              |
| Form layout/validation | `field`, `label`                                                                            |
| Data display           | `table`, `card`, `badge`, `avatar`, `kbd`, `item`                                           |
| Navigation             | `sidebar`, `navigation-menu`, `breadcrumb`, `tabs`, `pagination`                            |
| Overlays               | `dialog`, `sheet`, `alert-dialog`, `popover`, `hover-card`, `tooltip`                       |
| Menus                  | `dropdown-menu`, `context-menu`, `menubar`, `command`                                       |
| Feedback               | `sonner` (toasts), `alert`, `progress`, `skeleton`, `spinner`                               |
| Layout/containers      | `card`, `separator`, `resizable`, `scroll-area`, `accordion`, `collapsible`, `aspect-ratio` |
| Empty states           | `empty`                                                                                     |
| Dates                  | `calendar`, `date-picker`                                                                   |
| Icons                  | `icon` (`@ng-icons`)                                                                        |
| Typography             | `typography`                                                                                |

## Workflow

1. **Get context.** Run `@spartan-ng/cli:info --json`. If the project is not set up, run `:init`,
   then add components with `:ui` (the first `:ui` run creates `components.json`).
2. **Check what is installed.** Do not re-add anything in `installedComponents`.
3. **Find the component.** Use the MCP tools or `https://www.spartan.ng/components/<name>` for the
   API and examples (`mcp.md`). Never guess selectors - confirm them.
4. **Add it.** `npx nx g @spartan-ng/cli:ui --name=<component>` (Nx) or
   `ng g @spartan-ng/cli:ui --name=<component>` (Angular CLI). This installs the Brain dependency and
   copies the Helm code. Omit `--name` to get an interactive multiselect.
5. **Compose correctly.** Import the `*Imports` const (e.g. `HlmDialogImports`) or the individual
   classes from the import alias, add them to the standalone component's `imports`, and follow the
   composition rules.
6. **Register icons.** Any `<ng-icon>` you use must be passed to `provideIcons(...)` (see
   `rules/icons.md`).
7. **Verify.** After bigger changes or upgrades, run `@spartan-ng/cli:healthcheck` to catch
   deprecated patterns and fix imports.
8. **Theme/customize.** Edit the copied Helm files and the CSS variables; do not fork Brain.

## Quick reference

```bash
# Initialize (creates components.json, wires Tailwind + preset)
npx nx g @spartan-ng/cli:init
ng g @spartan-ng/cli:init

# Project context as JSON
npx nx g @spartan-ng/cli:info --json

# Add components (interactive, or pass --name)
npx nx g @spartan-ng/cli:ui
npx nx g @spartan-ng/cli:ui --name=dialog

# Generate theme variables
npx nx g @spartan-ng/cli:ui-theme

# Scan + auto-fix deprecated APIs/imports after an upgrade
npx nx g @spartan-ng/cli:healthcheck --autoFix
```
