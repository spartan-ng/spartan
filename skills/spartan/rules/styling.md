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

## Make your own component override-friendly

When you build a component or directive in the "hlm-like" fashion, let callers pass classes that
merge cleanly over your base styles. There are two patterns, both used across the hlm components.

### Preferred: `classes()`

Call `classes()` from `@spartan-ng/helm/utils` in the constructor. It applies your base classes to
the host element and automatically merges (via `hlm()`) any `class` the consumer puts on the host,
with the consumer's classes winning conflicts. No `class` input or binding needed, and it works
the same on components and directives:

```ts
import { Component } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'app-badge',
	template: '<ng-content />',
})
export class AppBadge {
	constructor() {
		classes(() => 'inline-flex items-center rounded-md border px-2 py-0.5');
	}
}
```

A consumer writes `<app-badge class="bg-primary text-primary-foreground">` and it merges
automatically. Because it manages the host `class` directly, it avoids clashing with other class
bindings.

### Explicit: a `class` input merged with `hlm()`

When you need to fold the user's class into a `computed` alongside conditional classes, take a
`class`-aliased input and bind the merged result yourself. Put the user's class last so it wins:

```ts
import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'app-badge',
	template: '<ng-content />',
	host: { '[class]': '_computedClass()' },
})
export class AppBadge {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('inline-flex items-center rounded-md border px-2 py-0.5', this.userClass()),
	);
}
```

## Overlays: no manual z-index

Dialog, Sheet, Popover, Tooltip, Dropdown, and other overlay components manage stacking via the
Angular CDK overlay. Do not set `z-index` on them manually.
