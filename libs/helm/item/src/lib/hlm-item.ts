import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { injectHlmItemConfig } from './hlm-item-token';

const itemVariants = cva(
	'spartan-item group/item focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors',
	{
		variants: {
			variant: {
				default: 'spartan-item-variant-default',
				outline: 'spartan-item-variant-outline',
				muted: 'spartan-item-variant-muted',
			},
			size: {
				default: 'spartan-item-size-default',
				sm: 'spartan-item-size-sm',
				xs: 'spartan-item-size-xs',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export type ItemVariants = VariantProps<typeof itemVariants>;

@Directive({
	selector: '[hlmItem],hlm-item',
	host: {
		'data-slot': 'item',
		'[attr.data-variant]': 'variant()',
		'[attr.data-size]': 'size()',
	},
})
export class HlmItem {
	private readonly _config = injectHlmItemConfig();
	public readonly variant = input<ItemVariants['variant']>(this._config.variant);
	public readonly size = input<ItemVariants['size']>(this._config.size);

	constructor() {
		classes(() => itemVariants({ variant: this.variant(), size: this.size() }));
	}
}
