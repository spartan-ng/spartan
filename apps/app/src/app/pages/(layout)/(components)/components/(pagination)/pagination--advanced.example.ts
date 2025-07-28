import { Component, signal } from '@angular/core';
import { HlmNumberedPaginationComponent } from '@spartan-ng/helm/pagination';

@Component({
	selector: 'spartan-pagination-advanced',
	imports: [HlmNumberedPaginationComponent],
	template: `
		<hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="totalProducts()" />
	`,
})
export class PaginationAdvancedComponent {
	public page = signal(1);
	public pageSize = signal(10);
	public totalProducts = signal(100);
}
