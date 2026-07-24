import { Directive, input } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputGroupAddonVariants = cva('spartan-input-group-button flex items-center shadow-none', {
	variants: {
		size: {
			xs: 'spartan-input-group-button-size-xs',
			sm: 'spartan-input-group-button-size-sm',
			'icon-xs': 'spartan-input-group-button-size-icon-xs',
			'icon-sm': 'spartan-input-group-button-size-icon-sm',
		},
	},
	defaultVariants: {
		size: 'xs',
	},
});

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
	selector: 'button[hlmInputGroupButton]',
	providers: [
		provideBrnButtonConfig({
			variant: 'ghost',
		}),
	],
	hostDirectives: [
		{
			directive: HlmButton,
			inputs: ['variant'],
		},
	],
	host: {
		'[attr.data-size]': 'size()',
		'[type]': 'type()',
	},
})
export class HlmInputGroupButton {
	public readonly size = input<InputGroupAddonVariants['size']>('xs');
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	constructor() {
		classes(() => inputGroupAddonVariants({ size: this.size() }));
	}
}
