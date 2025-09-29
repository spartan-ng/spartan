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
	public readonly page = signal(1);
	public readonly pageSize = signal(10);
	public readonly totalProducts = signal(100);
}
