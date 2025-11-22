import { Component } from '@angular/core';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';

@Component({
	selector: 'spartan-pagination-preview',
	imports: [HlmPaginationImports],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous link="/components/menubar" />
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
					<hlm-pagination-next link="/components/popover" />
				</li>
			</ul>
		</nav>
	`,
})
export class PaginationPreview {}

export const defaultImports = `
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
`;

export const defaultSkeleton = `
<nav hlmPagination>
  <ul hlmPaginationContent>
    <li hlmPaginationItem>
      <hlm-pagination-previous link="/components/menubar" />
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
      <hlm-pagination-next link="/components/popover" />
    </li>
  </ul>
</nav>
`;
