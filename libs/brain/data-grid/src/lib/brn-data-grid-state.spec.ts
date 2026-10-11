import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
} from '@tanstack/angular-table';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRestAdapter } from './adapters/rest-adapter';
import { injectBrnDataGrid } from './brn-data-grid-state';
import type { BrnDataAdapter, BrnGridState } from './brn-data-source';

describe('rest query mapping (core contract)', () => {
	it('maps page 2 + sort + filter to query object', () => {
		const adapter: BrnDataAdapter<{ id: string }, Record<string, string>> = {
			buildQuery: (s: BrnGridState) => ({
				page: String(s.page + 1),
				pageSize: String(s.pageSize),
				sortBy: s.sorting[0]?.id ?? '',
			}),
			fetch: vi.fn(async () => ({ rows: [], total: 0 })),
		};
		const q = adapter.buildQuery({ page: 1, pageSize: 10, sorting: [{ id: 'email', desc: true }], filters: [] });
		expect(q).toEqual({ page: '2', pageSize: '10', sortBy: 'email' });
	});
	it('aborts stale fetch so slow page 0 cannot overwrite fast page 1', async () => {
		const adapter: BrnDataAdapter<string, { page: number }> = {
			buildQuery: (s) => ({ page: s.page }),
			fetch: (q, signal) =>
				new Promise((resolve, reject) => {
					const t = setTimeout(() => resolve({ rows: [`p${q.page}`], total: 20 }), q.page === 0 ? 200 : 10);
					signal.addEventListener('abort', () => {
						clearTimeout(t);
						reject(new DOMException('aborted', 'AbortError'));
					});
				}),
		};
		const c1 = new AbortController();
		const p1 = adapter.fetch(adapter.buildQuery({ page: 0, pageSize: 10, sorting: [], filters: [] }), c1.signal);
		c1.abort();
		await expect(p1).rejects.toThrow();
		const rows = await adapter.fetch(
			adapter.buildQuery({ page: 1, pageSize: 10, sorting: [], filters: [] }),
			new AbortController().signal,
		);
		expect(rows.rows).toEqual(['p1']);
	});
});

type DebounceUser = { name: string; email: string };

const debounceFeatures = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSortingFeature,
});

const debounceColumnHelper = createColumnHelper<typeof debounceFeatures, DebounceUser>();
const debounceColumns = [
	debounceColumnHelper.accessor('name', { id: 'name', header: 'Name', cell: (info) => info.getValue<string>() }),
	debounceColumnHelper.accessor('email', { id: 'email', header: 'Email', cell: (info) => info.getValue<string>() }),
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('injectBrnDataGrid filter debounce', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});
	afterEach(() => {
		TestBed.resetTestingModule();
	});

	function createGrid(debounceMs = 60) {
		return TestBed.runInInjectionContext(() =>
			injectBrnDataGrid<DebounceUser>({
				adapter: createRestAdapter<DebounceUser>({
					baseUrl: '/api/users',
					fetchFn: async () => ({ rows: [], total: 0 }),
				}),
				initial: { pageSize: 5 },
				debounceMs,
				features: debounceFeatures,
				columns: debounceColumns,
			}),
		);
	}

	it('holds the filter-driven query past the debounce window, then applies it', async () => {
		const grid = createGrid(60);
		TestBed.inject(ApplicationRef).tick();
		const before = grid.query();
		grid.table.getColumn('email')?.setFilterValue('ada');
		TestBed.inject(ApplicationRef).tick();
		// Immediate UI state (input stays responsive) while the query is debounced.
		// (Asserted on the TanStack-visible state signal: the table instance itself only
		// re-syncs on change detection, which this injection-context test does not run.)
		expect(grid.state().filters).toEqual([{ id: 'email', value: 'ada' }]);
		expect(grid.query()).toEqual(before);
		await sleep(200);
		TestBed.inject(ApplicationRef).tick();
		expect(grid.query()['filter[email]']).toBe('ada');
		expect(grid.query()).not.toEqual(before);
	});

	it('applies pagination immediately, flushing a pending filter', async () => {
		const grid = createGrid(60);
		TestBed.inject(ApplicationRef).tick();
		grid.table.getColumn('email')?.setFilterValue('ada');
		TestBed.inject(ApplicationRef).tick();
		grid.table.setPageIndex(1);
		TestBed.inject(ApplicationRef).tick();
		// No sleep: page/sort skip the debounce window and carry pending filters with them.
		expect(grid.query().page).toBe('2');
		expect(grid.query()['filter[email]']).toBe('ada');
	});
});
