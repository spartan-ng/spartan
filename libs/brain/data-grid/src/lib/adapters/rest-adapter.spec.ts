import { describe, expect, it } from 'vitest';
import { createRestAdapter } from './rest-adapter';

describe('createRestAdapter', () => {
	it('builds page, pageSize, sort and filter params', () => {
		const a = createRestAdapter<string>({ baseUrl: '/api/payments', fetchFn: async () => ({ rows: [], total: 0 }) });
		expect(
			a.buildQuery({
				page: 1,
				pageSize: 25,
				sorting: [{ id: 'email', desc: true }],
				filters: [{ id: 'email', value: 'x@y' }],
			}),
		).toEqual({ page: '2', pageSize: '25', sortBy: 'email', sortDir: 'desc', 'filter[email]': 'x@y' });
	});
	it('exposes raw state so caller can debounce filters but not pagination', async () => {
		const a = createRestAdapter<string>({ baseUrl: '/x', fetchFn: async () => ({ rows: [], total: 0 }) });
		const filterQ = a.buildQuery({ page: 0, pageSize: 10, sorting: [], filters: [{ id: 'email', value: 'a' }] });
		const pageQ = a.buildQuery({ page: 3, pageSize: 10, sorting: [], filters: [] });
		expect(filterQ['filter[email]']).toBe('a');
		expect(pageQ.page).toBe('4');
	});
});
