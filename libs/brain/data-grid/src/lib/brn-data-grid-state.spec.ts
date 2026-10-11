import { describe, expect, it, vi } from 'vitest';
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
