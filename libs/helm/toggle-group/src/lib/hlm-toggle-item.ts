import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectHlmToggleGroup } from './hlm-toggle-group.token';

export const toggleGroupItemVariants = cva(
	'ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon]:text-base',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border-input hover:bg-accent hover:text-accent-foreground border bg-transparent',
			},
			size: {
				default: 'h-10 min-w-10 px-3',
				sm: 'h-9 min-w-9 px-2',
				lg: 'h-11 min-w-11 px-5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;

@Directive({
	selector: '[hlmToggleGroupItem],[brnToggleGroupItem][hlm]',
	host: {
		'[class]': '_computedClass()',
		'[attr.data-variant]': 'variant()',
	},
})
export class HlmToggleGroupItem {
	private readonly _parentGroup = injectHlmToggleGroup();
	public readonly variant = input<ToggleGroupItemVariants['variant']>('outline');
	public readonly size = input<ToggleGroupItemVariants['size']>('sm');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => {
		const variant = this._parentGroup?.variant() ?? this.variant();
		const size = this._parentGroup?.size() ?? this.size();

		return hlm(
			toggleGroupItemVariants({
				variant,
				size,
			}),
			'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
			this.userClass(),
		);
	});
}
