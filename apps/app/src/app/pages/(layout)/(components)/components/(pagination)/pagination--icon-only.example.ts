import { Component } from '@angular/core';
import {
	HlmPagination,
	HlmPaginationContent,
	HlmPaginationEllipsis,
	HlmPaginationItem,
	HlmPaginationLink,
	HlmPaginationNext,
	HlmPaginationPrevious,
} from '@spartan-ng/helm/pagination';

@Component({
	selector: 'spartan-pagination-icon-only',
	imports: [
		HlmPagination,
		HlmPaginationContent,
		HlmPaginationItem,
		HlmPaginationPrevious,
		HlmPaginationNext,
		HlmPaginationLink,
		HlmPaginationEllipsis,
	],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous iconOnly="true" link="/components/menubar" />
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
					<hlm-pagination-next iconOnly="true" link="/components/popover" />
				</li>
			</ul>
		</nav>
	`,
})
export class PaginationIconOnly {}
