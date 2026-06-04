# Styling rules

spartan/ui styles with Tailwind. The styled (Helm) layer is built with
[class-variance-authority](https://cva.style) and merged with the `hlm()` utility.

## Semantic colors only

Never use raw Tailwind palette values (`bg-blue-500`, `text-gray-700`) on spartan components. Use the
semantic tokens defined by the preset and CSS variables. Each has a paired `-foreground` for content
placed on top of it:

`background` / `foreground`, `card` / `card-foreground`, `popover` / `popover-foreground`,
`primary` / `primary-foreground`, `secondary` / `secondary-foreground`,
`muted` / `muted-foreground`, `accent` / `accent-foreground`,
`destructive` / `destructive-foreground`, plus the standalone `border`, `input`, and `ring`, and the
`sidebar*` family.

```html
<!-- Good -->
<div class="bg-card text-card-foreground border-border border">...</div>
<div class="bg-primary text-primary-foreground">...</div>

<!-- Bad -->
<div class="border-gray-200 bg-white text-black">...</div>
<div class="bg-blue-600 text-white">...</div>
```

These tokens automatically flip in dark mode, so you never write dark-mode color overrides by hand.

## Prefer built-in variants

Components expose `variant` and `size` inputs. Use them instead of re-styling with classes.

```html
<button hlmBtn variant="outline" size="sm">Cancel</button>
<span hlmBadge variant="secondary">beta</span>
<div hlmAlert variant="destructive">...</div>
```

Button variants: `default | destructive | outline | secondary | ghost | link`.
Button sizes: `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`.

## `class` is for layout only

Use the `class` attribute to position and space components (flex, grid, gap, margins, widths). Do
not use it to override a component's own colors, typography, or internal padding - change the copied
Helm file or a CSS variable instead.

## Spacing: `gap-*`, not `space-*`

Use `flex`/`grid` with `gap-*` for spacing between items. Avoid `space-x-*` / `space-y-*`.

```html
<!-- Good -->
<div class="flex flex-col gap-4">...</div>
<!-- Bad -->
<div class="space-y-4">...</div>
```

## `size-*` for equal dimensions

When width and height are equal, use `size-*` rather than `w-* h-*`.

```html
<div class="size-8 rounded-full">...</div>
<!-- not w-8 h-8 -->
```

## Use `truncate`

Use the `truncate` shorthand instead of manually combining `overflow-hidden text-ellipsis
whitespace-nowrap`.

## The `hlm()` utility

When you compute classes in TypeScript, merge them with `hlm()` from `@spartan-ng/helm/utils` (it
wraps `clsx` + `tailwind-merge`, so later classes win conflicts). Do not concatenate class strings
by hand.

```ts
import { hlm } from '@spartan-ng/helm/utils';

const cls = hlm('rounded-md border px-3 py-2', active() && 'bg-accent', userClass());
```

## Overlays: no manual z-index

Dialog, Sheet, Popover, Tooltip, Dropdown, and other overlay components manage stacking via the
Angular CDK overlay. Do not set `z-index` on them manually.
