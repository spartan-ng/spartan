import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ul[hlmPaginationContent]',
	host: {
		'data-slot': 'pagination-content',
	},
})
export class HlmPaginationContent {
	constructor() {
		classes(() => 'flex flex-row items-center gap-1');
	}
}
