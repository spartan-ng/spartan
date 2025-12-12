import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { cva, VariantProps } from 'class-variance-authority';

const emptyMediaVariants = cva(
	'mb-2 flex shrink-0 items-center justify-center [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_ng-icon:not([class*='text-'])]:text-2xl",
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;

@Directive({
	selector: '[hlmEmptyMedia],hlm-empty-media',
	host: {
		'data-slot': 'empty-media',
	},
})
export class HlmEmptyMedia {
	constructor() {
		classes(() => emptyMediaVariants({ variant: this.variant() }));
	}

	public readonly variant = input<EmptyMediaVariants['variant']>();
}
