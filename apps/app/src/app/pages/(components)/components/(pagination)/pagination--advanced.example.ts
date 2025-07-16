import { Component, signal } from '@angular/core';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';

@Component({
	selector: 'spartan-pagination-advanced',
	imports: [HlmNumberedPagination],
	template: `
		<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="totalProducts()" />
	`,
})
export class PaginationAdvanced {
	public page = signal(1);
	public pageSize = signal(10);
	public totalProducts = signal(100);
}
