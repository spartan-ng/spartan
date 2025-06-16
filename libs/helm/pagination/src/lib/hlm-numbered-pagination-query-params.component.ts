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
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { createPageArray, outOfBoundCorrection } from './hlm-numbered-pagination.component';
import { HlmPaginationContentDirective } from './hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from './hlm-pagination-ellipsis.component';
import { HlmPaginationItemDirective } from './hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from './hlm-pagination-next.component';
import { HlmPaginationPreviousComponent } from './hlm-pagination-previous.component';
import { HlmPaginationDirective } from './hlm-pagination.directive';

@Component({
	selector: 'hlm-numbered-pagination-query-params',
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
						<li hlmPaginationItem>
							<hlm-pagination-previous
								[link]="link()"
								[queryParams]="{ page: currentPage() - 1 }"
								queryParamsHandling="merge"
							/>
						</li>
					}

					@for (page of pages(); track page) {
						<li hlmPaginationItem>
							@if (page === '...') {
								<hlm-pagination-ellipsis />
							} @else {
								<a
									hlmPaginationLink
									[link]="currentPage() !== page ? link() : undefined"
									[queryParams]="{ page }"
									queryParamsHandling="merge"
									[isActive]="currentPage() === page"
								>
									{{ page }}
								</a>
							}
						</li>
					}

					@if (showEdges() && !isLastPageActive()) {
						<li hlmPaginationItem>
							<hlm-pagination-next
								[link]="link()"
								[queryParams]="{ page: currentPage() + 1 }"
								queryParamsHandling="merge"
							/>
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
export class HlmNumberedPaginationQueryParamsComponent {
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
	 * The URL path to use for the pagination links.
	 * Defaults to '.' (current path).
	 */
	public readonly link = input<string>('.');

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
}
