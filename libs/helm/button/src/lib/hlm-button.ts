import { Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base",
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
				outline:
					'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
				ghost:
					'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
				destructive:
					'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
				xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_ng-icon:not([class*='text-'])]:text-xs",
				sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_ng-icon:not([class*='text-'])]:text-sm",
				lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3',
				icon: 'size-8',
				'icon-xs':
					"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_ng-icon:not([class*='text-'])]:text-xs",
				'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
				'icon-lg': 'size-9',
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
