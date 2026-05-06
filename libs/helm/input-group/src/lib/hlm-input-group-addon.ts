import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputGroupAddonVariants = cva(
	'spartan-input-group-addon flex cursor-text items-center justify-center select-none',
	{
		variants: {
			align: {
				'inline-start': 'spartan-input-group-addon-align-inline-start order-first',
				'inline-end': 'spartan-input-group-addon-align-inline-end order-last',
				'block-start': 'spartan-input-group-addon-align-block-start order-first w-full justify-start',
				'block-end': 'spartan-input-group-addon-align-block-end order-last w-full justify-start',
			},
		},
		defaultVariants: {
			align: 'inline-start',
		},
	},
);

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
	selector: '[hlmInputGroupAddon],hlm-input-group-addon',
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
