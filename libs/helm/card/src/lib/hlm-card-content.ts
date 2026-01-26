import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCardContent]',
	host: {
		'data-slot': 'card-content',
	},
})
export class HlmCardContent {
	constructor() {
		classes(() => 'px-6 group-data-[size=sm]/card:px-4');
	}
}
