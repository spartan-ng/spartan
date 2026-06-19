# Icons

spartan/ui renders icons with [`@ng-icons`](https://ng-icons.github.io/ng-icons). The default set is
Lucide (`@ng-icons/lucide`).

## The element

Icons are an `<ng-icon>` element with the `name`:

```html
<ng-icon name="lucideChevronRight" />
```

## Register every icon

Icon names are not global - each icon you reference must be provided to the component (or app) via
`provideIcons`. Import the symbol from its set and register it:

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideTrash } from '@ng-icons/lucide';

@Component({
	selector: 'app-example',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<ng-icon name="lucideChevronRight" />
	`,
})
export class ExampleComponent {}
```

If an icon does not render, the usual cause is a missing `provideIcons` entry.

For free-standing decorative icons you may set color with a semantic class
(`class="text-muted-foreground"`).

## Sizing

`<ng-icon>` inherits its size from the font size of its parent. Use a Tailwind font-size utility to scale it, following the spacing scale:

```html
<ng-icon name="lucideChevronRight" class="text-[length:--spacing(4)]" />
```

## Installing the icon component

`npx nx g @spartan-ng/cli:ui --name=icon` (or `ng g ...`) installs `@ng-icons/core`,
`@ng-icons/lucide`, and the Helm icon styles.
