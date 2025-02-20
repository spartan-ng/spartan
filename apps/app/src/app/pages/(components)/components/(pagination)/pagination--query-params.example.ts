import { Component, computed, inject, numberAttribute } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-pagination-query-params',
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
	],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				@if (currentPage() > 1) {
					<li hlmPaginationItem>
						<hlm-pagination-previous link="." [queryParams]="{ page: currentPage() - 1 }" queryParamsHandling="merge" />
					</li>
				}
				@for (page of pages; track 'page_' + page) {
					<li hlmPaginationItem>
						<a
							hlmPaginationLink
							[link]="currentPage() !== page ? '.' : undefined"
							[queryParams]="{ page }"
							queryParamsHandling="merge"
							[isActive]="currentPage() === page"
						>
							{{ page }}
						</a>
					</li>
				}

				@if (currentPage() < pages[pages.length - 1]) {
					<li hlmPaginationItem>
						<hlm-pagination-next link="." [queryParams]="{ page: currentPage() + 1 }" queryParamsHandling="merge" />
					</li>
				}
			</ul>
		</nav>
	`,
})
export class PaginationQueryParamsComponent {
	private readonly _route = inject(ActivatedRoute);

	/**
	 * Alternative would be to enable `withComponentInputBinding` in `provideRouter`.
	 * Than you can bind `input` signal to the query param.
	 *
	 * ```ts
	 * pageQuery = input<number, NumberInput>(1, {
	 *   alias: 'page',
	 *   transform: (value) => numberAttribute(value, 1),
	 * });
	 * ```
	 *
	 * This can replace `_pageQuery` and `currentPage` computed property.
	 */
	private readonly _pageQuery = toSignal(
		this._route.queryParamMap.pipe(
			map((params) => {
				const pageQuery = params.get('page');
				return pageQuery ? numberAttribute(pageQuery, 1) : undefined;
			}),
		),
	);

	public currentPage = computed(() => this._pageQuery() ?? 1);

	public pages = [1, 2, 3, 4];
}

export const queryParamsCode = `
import { Component, computed, inject, numberAttribute } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';
import { map } from 'rxjs';

@Component({
	selector: 'spartan-pagination-query-params',
	standalone: true,
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
	],
	template: \`
		<nav hlmPagination>
			<ul hlmPaginationContent>
				@if (currentPage() > 1) {
					<li hlmPaginationItem>
						<hlm-pagination-previous link="." [queryParams]="{ page: currentPage() - 1 }" queryParamsHandling="merge" />
					</li>
				}
				@for (page of pages; track 'page_' + page) {
					<li hlmPaginationItem>
						<a
							hlmPaginationLink
							[link]="currentPage() !== page ? '.' : undefined"
							[queryParams]="{ page }"
							queryParamsHandling="merge"
							[isActive]="currentPage() === page"
						>
							{{ page }}
						</a>
					</li>
				}

				@if (currentPage() < pages[pages.length - 1]) {
					<li hlmPaginationItem>
						<hlm-pagination-next link="." [queryParams]="{ page: currentPage() + 1 }" queryParamsHandling="merge" />
					</li>
				}
			</ul>
		</nav>
	\`,
})
export class PaginationQueryParamsComponent {
	private readonly _route = inject(ActivatedRoute);

	/**
	 * Alternative would be to enable \`withComponentInputBinding\` in \`provideRouter\`.
	 * Than you can bind \`input\` signal to the query param.
	 *
	 * \`\`\`ts
	 * pageQuery = input<number, NumberInput>(1, {
	 *   alias: 'page',
	 *   transform: (value) => numberAttribute(value, 1),
	 * });
	 * \`\`\`
	 *
	 * This can replace \`_pageQuery\` and \`currentPage\` computed property.
	 */
	private readonly _pageQuery = toSignal(
		this._route.queryParamMap.pipe(
			map((params) => {
				const pageQuery = params.get('page');
				return pageQuery ? numberAttribute(pageQuery, 1) : undefined;
			}),
		),
	);

	public currentPage = computed(() => this._pageQuery() ?? 1);

	public pages = [1, 2, 3, 4];
}
`;
