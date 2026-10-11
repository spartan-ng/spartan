import { computed, resource, signal, type ResourceRef } from '@angular/core';
import { injectTable } from '@tanstack/angular-table';
import type { BrnDataAdapter, BrnGridState } from './brn-data-source';

export function injectBrnDataGrid<TData>(opts: {
	adapter: BrnDataAdapter<TData, any>;
	initial?: Partial<BrnGridState>;
	debounceMs?: number;
	serverFetch?: boolean;
	features: any;
	columns: any[];
}) {
	const state = signal<BrnGridState>({
		page: opts.initial?.page ?? 0,
		pageSize: opts.initial?.pageSize ?? 10,
		sorting: opts.initial?.sorting ?? [],
		filters: opts.initial?.filters ?? [],
		globalFilter: opts.initial?.globalFilter,
	});
	const query = computed(() => opts.adapter.buildQuery(state()));
	const res: ResourceRef<{ rows: TData[]; total: number } | undefined> = resource({
		params: () => ({ q: query(), page: state().page, sorting: state().sorting }),
		loader: ({ params, abortSignal }: any) => opts.adapter.fetch(params.q, abortSignal),
	});
	const data = computed(() => res.value()?.rows ?? []);
	const total = computed(() => res.value()?.total ?? 0);
	const loading = computed(() => res.isLoading());
	const error = computed(() => res.error() ?? null);
	const table = injectTable(() => ({
		features: opts.features,
		columns: opts.columns,
		data: data(),
		rowCount: total(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		onPaginationChange: (u: any) => {
			const next = typeof u === 'function' ? u({ pageIndex: state().page, pageSize: state().pageSize }) : u;
			state.update((s) => ({ ...s, page: next.pageIndex ?? s.page, pageSize: next.pageSize ?? s.pageSize }));
		},
		onSortingChange: (u: any) => state.update((s) => ({ ...s, sorting: typeof u === 'function' ? u(s.sorting) : u })),
		onColumnFiltersChange: (u: any) =>
			state.update((s) => ({ ...s, filters: typeof u === 'function' ? u(s.filters) : u })),
		state: {
			pagination: { pageIndex: state().page, pageSize: state().pageSize },
			sorting: state().sorting,
			columnFilters: state().filters,
		},
	}));
	return { table, state, query, data, total, loading, error, reload: () => res.reload() };
}
