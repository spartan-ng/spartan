import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCardFooter],hlm-card-footer',
	host: {
		'data-slot': 'card-footer',
	},
})
export class HlmCardFooter {
	constructor() {
		classes(
			() =>
				'flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4',
		);
	}
}
