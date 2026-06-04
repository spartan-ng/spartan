# Distribution and registry

## The spartan model

spartan/ui is **not** a single installed UI library. It uses a two-layer model:

- **Brain** primitives are real npm packages (`@spartan-ng/brain/<name>`), installed into
  `node_modules`. You do not edit them.
- **Helm** styled components are **copied into your project** (under `componentsPath`) by the CLI.
  You own this code and customize it freely.

This is why there is no "upgrade my installed components" button: Brain updates via npm + the
`healthcheck` migrations, while Helm code is yours to edit and re-generate.

## `components.json`

`components.json` is written at the project root on the first `ui` run (not by `init`). It is the
project marker the skill triggers on and the source of paths/aliases.

```json
{
	"componentsPath": "libs/ui",
	"importAlias": "@spartan-ng/helm",
	"buildable": true,
	"generateAs": "library"
}
```

- `componentsPath` - where Helm code is copied.
- `importAlias` - the import prefix for the copied Helm components (default `@spartan-ng/helm`).
- `buildable` - Nx only: whether generated libraries are buildable.
- `generateAs` - Nx only: `library` (one Nx library per component) or `entrypoint` (secondary
  entrypoints under a single library).

The Angular CLI variant only uses `componentsPath` and `importAlias`.

Read these values via `@spartan-ng/cli:info --json` rather than parsing the file yourself - the
`info` command applies defaults and reports `installedComponents`.

## Available components

The CLI ships a fixed catalog of components (the `availableComponents` in `info --json`). Add any of
them with `ui --name=<component>`. The shipped CLI does not wire up any remote or custom registry;
components come only from this bundled catalog.

## Custom usage

When generating into a non-default layout, pass `--directory` to `ui`, or set `componentsPath` /
`importAlias` in `components.json` before running. Do not invent registry URLs or remote sources -
if a user asks for a component that is not in `availableComponents`, tell them it is not in the
catalog rather than guessing.
