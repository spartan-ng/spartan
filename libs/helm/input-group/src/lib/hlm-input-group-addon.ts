import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputGroupAddonVariants = cva(
	"text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>ng-icon:not([class*='text-'])]:text-base",
	{
		variants: {
			align: {
				'inline-start': 'order-first ps-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
				'inline-end': 'order-last pe-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
				'block-start':
					'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3',
				'block-end': 'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3',
			},
		},
		defaultVariants: {
			align: 'inline-start',
		},
	},
);

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
	selector: 'hlm-input-group-addon,[hlmInputGroupAddon]',
	host: {
		role: 'group',
		'data-slot': 'input-group-addon',
		'[attr.data-align]': 'align()',
	},
})
export class HlmInputGroupAddon {
	public readonly align = input<InputGroupAddonVariants['align']>('inline-start');

	constructor() {
		classes(() => inputGroupAddonVariants({ align: this.align() }));
	}
}
