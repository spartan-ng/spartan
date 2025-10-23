import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectHlmItemConfig } from './hlm-item-token';

const itemVariants = cva(
	'group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border-border',
				muted: 'bg-muted/50',
			},
			size: {
				default: 'gap-4 p-4',
				sm: 'gap-2.5 px-4 py-3',
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
	selector: 'div[hlmItem], a[hlmItem]',
	host: {
		'data-slot': 'item',
		'[attr.data-variant]': 'variant()',
		'[attr.data-size]': 'size()',
		'[class]': '_computedClass()',
	},
})
export class HlmItem {
	private readonly _config = injectHlmItemConfig();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(itemVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
	);
	public readonly variant = input<ItemVariants['variant']>(this._config.variant);
	public readonly size = input<ItemVariants['size']>(this._config.size);
}
