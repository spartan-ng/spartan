import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCard],hlm-card',
	host: {
		'data-slot': 'card',
		'[attr.data-size]': 'size()',
	},
})
export class HlmCard {
	public readonly size = input<'sm' | 'default'>('default');

	constructor() {
		classes(() => 'spartan-card group/card flex flex-col');
	}
}
