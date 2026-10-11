import { computed, effect, resource, signal, type ResourceRef } from '@angular/core';
import { injectTable, type RowData } from '@tanstack/angular-table';
import type { BrnDataAdapter, BrnGridState } from './brn-data-source';

export function injectBrnDataGrid<TData extends RowData>(opts: {
	adapter: BrnDataAdapter<TData, any>;
	initial?: Partial<BrnGridState>;
	/** Debounce window for filter-driven fetches. Filter inputs stay responsive; only the query is delayed. */
	debounceMs?: number;
	/**
	 * Reserved for a future opt-in fetch mode. Fetches currently follow Angular `resource`
	 * (including SSR); this flag is accepted but has no behavior yet.
	 */
	serverFetch?: boolean;
	features: any;
	columns: any[];
}) {
	const debounceMs = opts.debounceMs ?? 300;
	const state = signal<BrnGridState>({
		page: opts.initial?.page ?? 0,
		pageSize: opts.initial?.pageSize ?? 10,
		sorting: opts.initial?.sorting ?? [],
		filters: opts.initial?.filters ?? [],
		globalFilter: opts.initial?.globalFilter,
	});
	// Debounced copy of the filter slices. The TanStack-visible `state` updates immediately
	// (inputs stay responsive) while `query` below reads the applied copy, so filter keystrokes
	// fetch once per pause instead of once per keystroke. Page/sort stay immediate via `query`.
	const appliedFilters = signal({ filters: state().filters, globalFilter: state().globalFilter });
	let filterTimer: ReturnType<typeof setTimeout> | undefined;
	const scheduleAppliedFilters = () => {
		clearTimeout(filterTimer);
		const next = { filters: state().filters, globalFilter: state().globalFilter };
		filterTimer = setTimeout(() => {
			const current = appliedFilters();
			if (current.filters !== next.filters || current.globalFilter !== next.globalFilter) {
				appliedFilters.set(next);
			}
		}, debounceMs);
	};
	// Safety net for filter updates that bypass the table handlers (direct `state` writes):
	// the same shared timer debounces them into the applied copy.
	effect((onCleanup) => {
		state().filters;
		state().globalFilter;
		scheduleAppliedFilters();
		onCleanup(() => clearTimeout(filterTimer));
	});
	// A page/sort change skips the debounce window and carries any pending filters with it.
	const flushAppliedFilters = () => {
		clearTimeout(filterTimer);
		filterTimer = undefined;
		const current = appliedFilters();
		if (current.filters !== state().filters || current.globalFilter !== state().globalFilter) {
			appliedFilters.set({ filters: state().filters, globalFilter: state().globalFilter });
		}
	};
	const query = computed(() =>
		opts.adapter.buildQuery({
			...state(),
			filters: appliedFilters().filters,
			globalFilter: appliedFilters().globalFilter,
		}),
	);
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
			flushAppliedFilters();
		},
		onSortingChange: (u: any) => {
			state.update((s) => ({ ...s, sorting: typeof u === 'function' ? u(s.sorting) : u }));
			flushAppliedFilters();
		},
		onColumnFiltersChange: (u: any) => {
			state.update((s) => ({ ...s, filters: typeof u === 'function' ? u(s.filters) : u }));
			scheduleAppliedFilters();
		},
		state: {
			pagination: { pageIndex: state().page, pageSize: state().pageSize },
			sorting: state().sorting,
			columnFilters: state().filters,
		},
	}));
	return { table, state, query, data, total, loading, error, reload: () => res.reload() };
}
