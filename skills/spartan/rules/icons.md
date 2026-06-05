# Icons

spartan/ui renders icons with [`@ng-icons`](https://ng-icons.github.io/ng-icons). The default set is
Lucide (`@ng-icons/lucide`). The `icon` component (`@spartan-ng/helm/icon`) provides the `hlm`
directive that sizes and styles icons consistently.

## The element

Icons are an `<ng-icon>` element with the `hlm` directive and a `name`:

```html
<ng-icon hlm name="lucideChevronRight" size="sm" />
```

## Register every icon

Icon names are not global - each icon you reference must be provided to the component (or app) via
`provideIcons`. Import the symbol from its set and register it:

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideTrash } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'app-example',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight, lucideTrash })],
	template: `
		<ng-icon hlm name="lucideChevronRight" size="sm" />
	`,
})
export class ExampleComponent {}
```

If an icon does not render, the usual cause is a missing `provideIcons` entry.

## Sizing: use the `size` input

Size icons with the `hlm` directive's `size` input (`xs | sm | base | lg | xl`), not Tailwind sizing
classes, when the icon is inside a component. This keeps icons aligned with the component's metrics.

```html
<button hlmBtn size="icon" variant="ghost">
	<ng-icon hlm name="lucideX" size="sm" />
</button>
```

For free-standing decorative icons you may set color with a semantic class
(`class="text-muted-foreground"`), but still prefer the `size` input over `w-*`/`h-*`.

## Installing the icon component

`npx nx g @spartan-ng/cli:ui --name=icon` (or `ng g ...`) installs `@ng-icons/core`,
`@ng-icons/lucide`, and the Helm icon styles.
