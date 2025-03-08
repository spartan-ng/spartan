import { Component, signal } from '@angular/core';
import { HlmNumberedPaginationComponent } from '@spartan-ng/ui-pagination-helm';

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

export const advancedCode = `
import { Component, signal } from '@angular/core';
import { HlmNumberedPaginationComponent } from '@spartan-ng/ui-pagination-helm';

@Component({
	selector: 'spartan-pagination-advanced',
	standalone: true,
	imports: [HlmNumberedPaginationComponent],
	template: \`
    <hlm-numbered-pagination
      [(currentPage)]="page"
      [(itemsPerPage)]="pageSize"
      [totalItems]="totalProducts()"
    />
	\`,
})
export class PaginationAdvancedComponent {
  page = signal(1);
  pageSize = signal(10);
  totalProducts = signal(100);
}
`;
