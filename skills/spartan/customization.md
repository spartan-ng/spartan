# Theming and customization

## Setup

spartan/ui requires Tailwind CSS v4. The global stylesheet needs
the Tailwind layers and the spartan preset.

```css
/* src/styles.css */
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
```

```css
/* src/styles.css - add the spartan preset (bundles tw-animate-css + the CDK overlay styles) */
@import '@spartan-ng/brain/hlm-tailwind-preset.css';
```

## Theme variables

Colors are driven by CSS variables (OKLCH) in `:root` (light) and `.dark` (dark). Generate them with
the CLI:

```bash
npx nx g @spartan-ng/cli:ui-theme
ng g @spartan-ng/cli:ui-theme
```

Or add them manually. The semantic tokens are: `background`, `foreground`, `card`/`card-foreground`,
`popover`/`popover-foreground`, `primary`/`primary-foreground`, `secondary`/`secondary-foreground`,
`muted`/`muted-foreground`, `accent`/`accent-foreground`, `destructive`, `border`, `input`, `ring`,
plus `--radius` and the `sidebar*` family. Reference them in templates via the matching Tailwind
classes (`bg-primary`, `text-muted-foreground`, `border-border`, ...). See `rules/styling.md`.

```css
:root {
	color-scheme: light;
	--radius: 0.625rem;
	--background: oklch(1 0 0);
	--foreground: oklch(0.145 0 0);
	--primary: oklch(0.205 0 0);
	--primary-foreground: oklch(0.985 0 0);
	/* ...rest of the tokens... */
}

.dark {
	color-scheme: dark;
	--background: oklch(0.145 0 0);
	--foreground: oklch(0.985 0 0);
	/* ...dark overrides... */
}
```

## Adding a custom color

Define the variable in both `:root` and `.dark`, then expose it to Tailwind with `@theme inline` so
`bg-warning` / `text-warning-foreground` work:

```css
:root {
	--warning: oklch(0.84 0.16 84);
	--warning-foreground: oklch(0.28 0.07 46);
}
.dark {
	--warning: oklch(0.41 0.11 46);
	--warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
	--color-warning: var(--warning);
	--color-warning-foreground: var(--warning-foreground);
}
```

## Dark mode

Dark mode is class-based: toggle the `dark` class on the `<html>` (or root) element and the
variables switch automatically. No component changes are needed. Typically a small service persists
the choice to `localStorage` and respects the system color scheme.

## Customizing components

Because Helm code is copied into your project, customize by editing those files directly - adjust the
`class-variance-authority` variants, change classes, or add inputs. Do not fork or edit the Brain
packages. After spartan upgrades, run `@spartan-ng/cli:healthcheck --autoFix` to reconcile
deprecated APIs.
