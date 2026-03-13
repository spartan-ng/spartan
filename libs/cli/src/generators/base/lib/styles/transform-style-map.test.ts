import { Project, ScriptKind } from 'ts-morph';

import { type StyleMap } from './create-style-map';
import { transformStyleMap } from './transform-style-map';

const baseStyleMap: StyleMap = {
	'spartan-foo': 'bg-background gap-4 rounded-xl',
	'spartan-button': `focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_ng-icon:not([class*='text-'])]:text-base`,
	'spartan-button-variant-default': `bg-primary text-primary-foreground hover:bg-primary/80`,
	'spartan-button-variant-outline': `border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-xs`,
	'spartan-button-variant-secondary': `bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground`,
	'spartan-button-variant-ghost': `hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground`,
	'spartan-button-variant-destructive': `bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30`,
	'spartan-button-variant-link': `text-primary underline-offset-4 hover:underline`,
	'spartan-button-size-xs': `h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_ng-icon:not([class*='text-'])]:text-sm`,
	'spartan-button-size-sm': `h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5`,
	'spartan-button-size-default': `h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2`,
	'spartan-button-size-lg': `h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3`,
	'spartan-button-size-icon-xs': `size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_ng-icon:not([class*='text-'])]:text-sm`,
	'spartan-button-size-icon-sm': `size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md`,
	'spartan-button-size-icon': `size-9`,
	'spartan-button-size-icon-lg': `size-10`,
};
async function applyTransform(source: string, styleMap: StyleMap) {
	const project = new Project({
		useInMemoryFileSystem: true,
	});

	const sourceFile = project.createSourceFile('component.ts', source, {
		scriptKind: ScriptKind.TS,
		overwrite: true,
	});

	await transformStyleMap({ sourceFile, styleMap });

	return sourceFile.getText();
}

describe('transformStyleMap', () => {
	describe('classes()', () => {
		it('transforms arrow string', async () => {
			const source = `
classes(() => 'flex spartan-foo');
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"classes(() => 'bg-background gap-4 rounded-xl flex');
"
`);
		});

		it('transforms array', async () => {
			const source = `
classes(() => [
 'flex',
 'spartan-foo'
])
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"classes(() => [
 'flex',
 'bg-background gap-4 rounded-xl'
])
"
`);
		});

		it('handles ternary', async () => {
			const source = `
classes(() => [
  this.variant() === 'spartan-foo' ? 'p-4' : 'p-2'
])
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"classes(() => [
  this.variant() === 'bg-background gap-4 rounded-xl' ? 'p-4' : 'p-2'
])
"
`);
		});
	});

	describe('hlm()', () => {
		it('replaces spartan class', async () => {
			const source = `
const cls = hlm("spartan-foo");
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"const cls = hlm("bg-background gap-4 rounded-xl");
"
`);
		});

		it('handles multiple classes', async () => {
			const source = `
const cls = hlm("spartan-foo spartan-bar");
`;

			const styleMap = {
				'spartan-foo': 'bg-background',
				'spartan-bar': 'rounded-xl',
			};

			const result = await applyTransform(source, styleMap);

			expect(result).toMatchInlineSnapshot(`
"const cls = hlm("bg-background rounded-xl");
"
`);
		});

		it('preserves additional arguments', async () => {
			const source = `
const cls = hlm("spartan-foo", className);
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"const cls = hlm("bg-background gap-4 rounded-xl", className);
"
`);
		});

		it('removes empty arguments', async () => {
			const source = `
const cls = hlm("spartan-foo", "", "extra", "");
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"const cls = hlm("bg-background gap-4 rounded-xl", "extra");
"
`);
		});
	});

	describe('html class attributes', () => {
		it('transforms html class attribute', async () => {
			const source = `
<div class="spartan-foo"></div>
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"<div class="bg-background gap-4 rounded-xl"></div>
"
`);
		});

		it('preserves allowlisted classes', async () => {
			const source = `
<div class="spartan-menu-target spartan-foo"></div>
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"<div class="bg-background gap-4 rounded-xl spartan-menu-target"></div>
"
`);
		});
	});

	describe('Angular components', () => {
		it('should replace string', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => 'flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col spartan-foo');
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => 'bg-background gap-4 rounded-xl flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col');
	}
}
"
`);
		});

		it('should replace array with condition', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => ['min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'spartan-foo' ? 'pl-4' : 'pt-4']));
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => ['min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'bg-background gap-4 rounded-xl' ? 'pl-4' : 'pt-4']));
	}
}
"
`);
		});

		it('should replace array', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmInputGroup {
	constructor() {
		classes(() => [
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'h-9 min-w-0 has-[>textarea]:h-auto spartan-foo',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:ps-2',
			'has-[>[data-align=inline-end]]:[&>input]:pe-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			// Focus state.
			'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			// Error state.
			'has-[>.ng-invalid.ng-touched]:ring-destructive/20 has-[>.ng-invalid.ng-touched]:border-destructive dark:has-[>.ng-invalid.ng-touched]:ring-destructive/40',
		]);
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmInputGroup {
	constructor() {
		classes(() => [
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'bg-background gap-4 rounded-xl h-9 min-w-0 has-[>textarea]:h-auto',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:ps-2',
			'has-[>[data-align=inline-end]]:[&>input]:pe-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			// Focus state.
			'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			// Error state.
			'has-[>.ng-invalid.ng-touched]:ring-destructive/20 has-[>.ng-invalid.ng-touched]:border-destructive dark:has-[>.ng-invalid.ng-touched]:ring-destructive/40',
		]);
	}
}
"
`);
		});

		it('transforms inline template', async () => {
			const source = `
@Component({
 template: '<div class="spartan-foo flex"></div>'
})
export class Foo {}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"@Component({
 template: '<div class="bg-background gap-4 rounded-xl flex"></div>'
})
export class Foo {}
"
`);
		});

		it('hlm button', async () => {
			const source = `
import { Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
        'spartan-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
        {
                variants: {
                        variant: {
                                default: 'spartan-button-variant-default',
                                outline: 'spartan-button-variant-outline',
                                secondary: 'spartan-button-variant-secondary',
                                ghost: 'spartan-button-variant-ghost',
                                destructive: 'spartan-button-variant-destructive',
                                link: 'spartan-button-variant-link',
                        },
                        size: {
                                default: 'spartan-button-size-default',
                                xs: 'spartan-button-size-xs',
                                sm: 'spartan-button-size-sm',
                                lg: 'spartan-button-size-lg',
                                icon: 'spartan-button-size-icon',
                                'icon-xs': 'spartan-button-size-icon-xs',
                                'icon-sm': 'spartan-button-size-icon-sm',
                                'icon-lg': 'spartan-button-size-icon-lg',
                        },
                },
                defaultVariants: {
                        variant: 'default',
                        size: 'default',
                },
        },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
        selector: 'button[hlmBtn], a[hlmBtn]',
        exportAs: 'hlmBtn',
        hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
        host: {
                'data-slot': 'button',
        },
})
export class HlmButton {
        private readonly _config = injectBrnButtonConfig();

        private readonly _additionalClasses = signal<ClassValue>('');

        public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

        public readonly size = input<ButtonVariants['size']>(this._config.size);

        constructor() {
                classes(() => [buttonVariants({ variant: this.variant(), size: this.size() }), this._additionalClasses()]);
        }

        setClass(classes: string): void {
                this._additionalClasses.set(classes);
        }
}
"
`;
			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
        'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_ng-icon:not([class*=\\'text-\\'])]:text-base group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
        {
                variants: {
                        variant: {
                                default: 'bg-primary text-primary-foreground hover:bg-primary/80',
                                outline: 'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-xs',
                                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
                                ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
                                destructive: 'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
                                link: 'text-primary underline-offset-4 hover:underline',
                        },
                        size: {
                                default: 'h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
                                xs: 'h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_ng-icon:not([class*=\\'text-\\'])]:text-sm',
                                sm: 'h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5',
                                lg: 'h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3',
                                icon: 'size-9',
                                'icon-xs': 'size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_ng-icon:not([class*=\\'text-\\'])]:text-sm',
                                'icon-sm': 'size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md',
                                'icon-lg': 'size-10',
                        },
                },
                defaultVariants: {
                        variant: 'default',
                        size: 'default',
                },
        },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
        selector: 'button[hlmBtn], a[hlmBtn]',
        exportAs: 'hlmBtn',
        hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
        host: {
                'data-slot': 'button',
        },
})
export class HlmButton {
        private readonly _config = injectBrnButtonConfig();

        private readonly _additionalClasses = signal<ClassValue>('');

        public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

        public readonly size = input<ButtonVariants['size']>(this._config.size);

        constructor() {
                classes(() => [buttonVariants({ variant: this.variant(), size: this.size() }), this._additionalClasses()]);
        }

        setClass(classes: string): void {
                this._additionalClasses.set(classes);
        }
}
"
"
`);
		});
	});
});
