import { Component, computed, inject, numberAttribute, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { HlmNumberedPaginationQueryParams } from '@spartan-ng/helm/pagination';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-pagination-advanced-query-params',
	imports: [HlmNumberedPaginationQueryParams],
	template: `
		<hlm-numbered-pagination-query-params
			[currentPage]="page()"
			[(itemsPerPage)]="pageSize"
			[totalItems]="totalProducts()"
		/>
	`,
})
export class PaginationAdvancedQuery {
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
	 * This can replace `_pageQuery` and `page` computed property.
	 */
	private readonly _pageQuery = toSignal(
		this._route.queryParamMap.pipe(
			map((params) => {
				const pageQuery = params.get('page');
				return pageQuery ? numberAttribute(pageQuery, 1) : undefined;
			}),
		),
	);
	public readonly page = computed(() => this._pageQuery() ?? 1);
	public readonly pageSize = signal(10);
	public readonly totalProducts = signal(100);
}
