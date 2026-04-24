import { Directive, input } from '@angular/core';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
	'spartan-toggle group/toggle hover:bg-muted inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
	{
		variants: {
			variant: {
				default: 'spartan-toggle-variant-default',
				outline: 'spartan-toggle-variant-outline',
			},
			size: {
				default: 'spartan-toggle-size-default',
				sm: 'spartan-toggle-size-sm',
				lg: 'spartan-toggle-size-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);
export type ToggleVariants = VariantProps<typeof toggleVariants>;

@Directive({
	selector: 'button[hlmToggle]',
	hostDirectives: [
		{
			directive: BrnToggle,
			inputs: ['id', 'value', 'disabled', 'state', 'aria-label', 'type'],
			outputs: ['stateChange'],
		},
	],
	host: {
		'data-slot': 'toggle',
	},
})
export class HlmToggle {
	public readonly variant = input<ToggleVariants['variant']>('default');
	public readonly size = input<ToggleVariants['size']>('default');
	constructor() {
		classes(() =>
			toggleVariants({
				variant: this.variant(),
				size: this.size(),
			}),
		);
	}
}
