import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const toggleVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 px-2',
				lg: 'h-10 px-3',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);
type ToggleVariants = VariantProps<typeof toggleVariants>;

@Directive({
	selector: '[hlmToggle],[brnToggle][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmToggleDirective {
	public readonly variant = input<ToggleVariants['variant']>('default');
	public readonly size = input<ToggleVariants['size']>('default');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(toggleVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
	);
}
