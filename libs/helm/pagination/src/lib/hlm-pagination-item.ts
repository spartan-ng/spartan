import { Directive } from '@angular/core';

@Directive({
	selector: 'li[hlmPaginationItem]',
	exportAs: 'hlmPaginationItem',
	host: { 'data-slot': 'pagination-item' },
})
export class HlmPaginationItem {}
