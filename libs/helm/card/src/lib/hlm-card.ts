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
		classes(
			() =>
				'group/card ring-foreground/10 bg-card text-card-foreground flex flex-col gap-6 overflow-hidden rounded-xl py-6 text-sm shadow-xs ring-1 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
		);
	}
}
