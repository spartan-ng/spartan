import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectHlmItemMediaConfig } from './hlm-item-token';

const itemMediaVariants = cva(
	'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_ng-icon]:pointer-events-none',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				icon: "bg-muted size-8 rounded-sm border [&_ng-icon:not([class*='text-'])]:text-base",
				image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);
export type ItemMediaVariants = VariantProps<typeof itemMediaVariants>;

@Directive({
	selector: '[hlmItemMedia],hlm-item-media',
	host: {
		'data-slot': 'item-media',
		'[attr.data-variant]': 'variant()',
		'[class]': '_computedClass()',
	},
})
export class HlmItemMedia {
	private readonly _config = injectHlmItemMediaConfig();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(itemMediaVariants({ variant: this.variant() }), this.userClass()),
	);
	public readonly variant = input<ItemMediaVariants['variant']>(this._config.variant);
}
