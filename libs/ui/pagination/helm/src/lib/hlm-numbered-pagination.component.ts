import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	computed,
	input,
	model,
	numberAttribute,
	untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmPaginationContentDirective } from './hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from './hlm-pagination-ellipsis.component';
import { HlmPaginationItemDirective } from './hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from './hlm-pagination-next.component';
import { HlmPaginationPreviousComponent } from './hlm-pagination-previous.component';
import { HlmPaginationDirective } from './hlm-pagination.directive';

@Component({
	selector: 'hlm-numbered-pagination',
	template: `
		<div class="flex items-center justify-between gap-2 px-4 py-2">
			<div class="flex items-center gap-1 text-nowrap text-sm text-gray-600">
				<b>{{ totalItems() }}</b>
				total items |
				<b>{{ pages().length }}</b>
				pages
			</div>

			<nav hlmPagination>
				<ul hlmPaginationContent>
					@if (showEdges() && !isFirstPageActive()) {
						<li hlmPaginationItem (click)="goToPrevious()">
							<hlm-pagination-previous />
						</li>
					}

					@for (page of pages(); track page) {
						<li hlmPaginationItem>
							@if (page === '...') {
								<hlm-pagination-ellipsis />
							} @else {
								<a hlmPaginationLink [isActive]="currentPage() === page" (click)="currentPage.set(page)">
									{{ page }}
								</a>
							}
						</li>
					}

					@if (showEdges() && !isLastPageActive()) {
						<li hlmPaginationItem (click)="goToNext()">
							<hlm-pagination-next />
						</li>
					}
				</ul>
			</nav>

			<!-- Show Page Size selector -->
			<brn-select [(ngModel)]="itemsPerPage" class="ml-auto" placeholder="Page size">
				<hlm-select-trigger class="w-fit">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					@for (pageSize of pageSizesWithCurrent(); track pageSize) {
						<hlm-option [value]="pageSize">{{ pageSize }} / page</hlm-option>
					}
				</hlm-select-content>
			</brn-select>
		</div>
	`,
	imports: [
		FormsModule,
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
		HlmPaginationEllipsisComponent,
		BrnSelectImports,
		HlmSelectImports,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmNumberedPaginationComponent {
	/**
	 * The current (active) page.
	 */
	public readonly currentPage = model.required<number>();

	/**
	 * The number of items per paginated page.
	 */
	public readonly itemsPerPage = model.required<number>();

	/**
	 * The total number of items in the collection. Only useful when
	 * doing server-side paging, where the collection size is limited
	 * to a single page returned by the server API.
	 */
	public readonly totalItems = input.required<number, NumberInput>({
		transform: numberAttribute,
	});

	/**
	 * The number of page links to show.
	 */
	public readonly maxSize = input<number, NumberInput>(7, {
		transform: numberAttribute,
	});

	/**
	 * Show the first and last page buttons.
	 */
	public readonly showEdges = input<boolean, BooleanInput>(true, {
		transform: booleanAttribute,
	});

	/**
	 * The page sizes to show.
	 * Defaults to [10, 20, 50, 100]
	 */
	public readonly pageSizes = input<number[]>([10, 20, 50, 100]);

	protected readonly pageSizesWithCurrent = computed(() => {
		const pageSizes = this.pageSizes();
		return pageSizes.includes(this.itemsPerPage())
			? pageSizes // if current page size is included, return the same array
			: [...pageSizes, this.itemsPerPage()].sort((a, b) => a - b); // otherwise, add current page size and sort the array
	});

	protected readonly isFirstPageActive = computed(() => this.currentPage() === 1);
	protected readonly isLastPageActive = computed(() => this.currentPage() === this.lastPageNumber());

	protected readonly lastPageNumber = computed(() => {
		if (this.totalItems() < 1) {
			// when there are 0 or fewer (an error case) items, there are no "pages" as such,
			// but it makes sense to consider a single, empty page as the last page.
			return 1;
		}
		return Math.ceil(this.totalItems() / this.itemsPerPage());
	});

	protected readonly pages = computed(() => {
		const correctedCurrentPage = outOfBoundCorrection(this.totalItems(), this.itemsPerPage(), this.currentPage());

		if (correctedCurrentPage !== this.currentPage()) {
			// update the current page
			untracked(() => this.currentPage.set(correctedCurrentPage));
		}

		return createPageArray(correctedCurrentPage, this.itemsPerPage(), this.totalItems(), this.maxSize());
	});

	protected goToPrevious(): void {
		this.currentPage.set(this.currentPage() - 1);
	}

	protected goToNext(): void {
		this.currentPage.set(this.currentPage() + 1);
	}

	protected goToFirst(): void {
		this.currentPage.set(1);
	}

	protected goToLast(): void {
		this.currentPage.set(this.lastPageNumber());
	}
}

type Page = number | '...';

/**
 * Checks that the instance.currentPage property is within bounds for the current page range.
 * If not, return a correct value for currentPage, or the current value if OK.
 *
 * Copied from 'ngx-pagination' package
 */
function outOfBoundCorrection(totalItems: number, itemsPerPage: number, currentPage: number): number {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	if (totalPages < currentPage && 0 < totalPages) {
		return totalPages;
	}

	if (currentPage < 1) {
		return 1;
	}

	return currentPage;
}

/**
 * Returns an array of Page objects to use in the pagination controls.
 *
 * Copied from 'ngx-pagination' package
 */
function createPageArray(
	currentPage: number,
	itemsPerPage: number,
	totalItems: number,
	paginationRange: number,
): Page[] {
	// paginationRange could be a string if passed from attribute, so cast to number.
	paginationRange = +paginationRange;
	const pages: Page[] = [];

	// Return 1 as default page number
	// Make sense to show 1 instead of empty when there are no items
	const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
	const halfWay = Math.ceil(paginationRange / 2);

	const isStart = currentPage <= halfWay;
	const isEnd = totalPages - halfWay < currentPage;
	const isMiddle = !isStart && !isEnd;

	const ellipsesNeeded = paginationRange < totalPages;
	let i = 1;

	while (i <= totalPages && i <= paginationRange) {
		let label: number | '...';
		const pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
		const openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
		const closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
		if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
			label = '...';
		} else {
			label = pageNumber;
		}
		pages.push(label);
		i++;
	}

	return pages;
}

/**
 * Given the position in the sequence of pagination links [i],
 * figure out what page number corresponds to that position.
 *
 * Copied from 'ngx-pagination' package
 */
function calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
	const halfWay = Math.ceil(paginationRange / 2);
	if (i === paginationRange) {
		return totalPages;
	}

	if (i === 1) {
		return i;
	}

	if (paginationRange < totalPages) {
		if (totalPages - halfWay < currentPage) {
			return totalPages - paginationRange + i;
		}
		if (halfWay < currentPage) {
			return currentPage - halfWay + i;
		}
		return i;
	}

	return i;
}
