import { Directive, computed, input } from '@angular/core';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

// TODO invalid styles uses aria-invalid
// aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
export const toggleVariants = cva(
	'hover:bg-muted hover:text-muted-foreground focus-visible:border-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:ring-ring/50 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*="text-"])]:text-base',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border-input hover:bg-accent hover:text-accent-foreground border bg-transparent shadow-xs',
			},
			size: {
				default: 'h-9 min-w-9 px-2',
				sm: 'h-8 min-w-8 px-1.5',
				lg: 'h-10 min-w-10 px-2.5',
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
		'[class]': '_computedClass()',
	},
})
export class HlmToggle {
	public readonly variant = input<ToggleVariants['variant']>('default');
	public readonly size = input<ToggleVariants['size']>('default');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			toggleVariants({
				variant: this.variant(),
				size: this.size(),
			}),
			this.userClass(),
		),
	);
}
