import { Component } from '@angular/core';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';

@Component({
	selector: 'spartan-pagination-icon-only',
	imports: [HlmPaginationImports],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<a hlmPaginationPrevious iconOnly="true" link="/components/menubar"></a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">1</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#" isActive>2</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">3</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationNext iconOnly="true" link="/components/popover"></a>
				</li>
			</ul>
		</nav>
	`,
})
export class PaginationIconOnly {}
