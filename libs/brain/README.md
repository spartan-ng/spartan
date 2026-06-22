# @spartan-ng/brain

[![npm version](https://img.shields.io/npm/v/@spartan-ng/brain.svg?style=flat-square)](https://www.npmjs.com/package/@spartan-ng/brain)
[![npm downloads](https://img.shields.io/npm/dm/@spartan-ng/brain.svg?style=flat-square)](https://www.npmjs.com/package/@spartan-ng/brain)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/1145806472172380160?style=flat-square&label=discord&logo=discord&logoColor=white&color=7289DA)](https://discord.gg/EqHnxQ4uQr)

[Website](https://www.spartan.ng) • [Documentation](https://www.spartan.ng/documentation/installation) • [Components](https://www.spartan.ng/components) • [GitHub](https://github.com/spartan-ng/spartan)

> Accessible, unstyled UI primitives for Angular. The behavior half of [spartan/ui](https://www.spartan.ng).

`@spartan-ng/brain` is a fully tree-shakable collection of headless Angular primitives - keyboard navigation, focus management, ARIA wiring, and state - with zero opinions about styling. Pair it with [`helm`](https://www.spartan.ng/documentation/installation) styles (copied into your codebase by the [spartan CLI](https://www.npmjs.com/package/@spartan-ng/cli)) for the full shadcn-style experience, or bring your own design system.

Inspired by [Radix UI](https://radix-ui.com) and [shadcn/ui](https://ui.shadcn.com), adapted for the Angular ecosystem.

## Installation

```bash
npm install @spartan-ng/brain
# or
pnpm add @spartan-ng/brain
# or
yarn add @spartan-ng/brain
```

For the easiest setup, use the [spartan CLI](https://www.npmjs.com/package/@spartan-ng/cli) - it installs the right secondary entry points and copies matching helm styles in one command:

```bash
npm install -D @spartan-ng/cli
ng g @spartan-ng/cli:init
ng g @spartan-ng/cli:ui
```

## Usage

Every primitive lives behind a secondary entry point so you only ship what you import:

```ts
import { Component } from '@angular/core';
import { BrnAccordionImports } from '@spartan-ng/brain/accordion';

@Component({
	selector: 'app-faq',
	imports: [BrnAccordionImports],
	template: `
		<brn-accordion>
			<brn-accordion-item>
				<brn-accordion-trigger>Is it accessible?</brn-accordion-trigger>
				<brn-accordion-content>
					Yes. brain ships with keyboard navigation and full ARIA out of the box.
				</brn-accordion-content>
			</brn-accordion-item>
		</brn-accordion>
	`,
})
export class Faq {}
```

Each primitive exports an `Imports` array (e.g. `BrnAccordionImports`, `BrnDialogImports`) for one-line wiring, or you can cherry-pick individual directives and components.

## Secondary Entry Points

Import from a specific entry point to keep your bundle lean:

```ts
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
```

Available entry points:

`accordion`, `alert-dialog`, `autocomplete`, `avatar`, `button`, `calendar`, `checkbox`, `collapsible`, `combobox`, `command`, `core`, `date-time`, `date-time-luxon`, `dialog`, `field`, `forms`, `hover-card`, `input`, `input-otp`, `label`, `navigation-menu`, `popover`, `progress`, `radio-group`, `resizable`, `select`, `separator`, `sheet`, `slider`, `sonner`, `switch`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

Browse the [components gallery](https://www.spartan.ng/components) for live demos, API docs, and styled helm examples for each primitive.

## Tailwind Preset

`@spartan-ng/brain` ships with the shared Tailwind preset that powers the helm styles. Most users have the [CLI](https://www.npmjs.com/package/@spartan-ng/cli) wire this up for them, but you can also do it by hand by adding the preset to your CSS:

```css
@import '@spartan-ng/brain/hlm-tailwind-preset.css';
```

spartan/ui requires Tailwind CSS v4.

## Peer Dependencies

`@spartan-ng/brain` works with:

- Angular `>=21.0.0 <23.0.0` (core, common, forms, cdk)
- `rxjs` `>=6.6.0`
- `clsx` `>=2.0.0`
- `tailwindcss` `>=4.0.0`
- `tw-animate-css` `>=1.0.0` _(imported by the Tailwind preset)_
- `luxon` `>=3.0.0` _(optional - only required for `@spartan-ng/brain/date-time-luxon`)_

## Documentation

- [Installation guide](https://www.spartan.ng/documentation/installation)
- [CLI documentation](https://www.spartan.ng/documentation/cli)
- [Theming](https://www.spartan.ng/documentation/theming)
- [Components](https://www.spartan.ng/components)

## Community

- [Discord](https://discord.gg/EqHnxQ4uQr)
- [GitHub](https://github.com/spartan-ng/spartan)
- [Twitter / X](https://twitter.com/goetzrobin)
- [Sponsor the project](https://github.com/sponsors/goetzrobin)

## License

MIT © [goetzrobin](https://github.com/goetzrobin) and the [spartan contributors](https://github.com/spartan-ng/spartan/graphs/contributors)
