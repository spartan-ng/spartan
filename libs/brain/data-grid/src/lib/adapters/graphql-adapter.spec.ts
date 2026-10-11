import { describe, expect, it } from 'vitest';
import { createGraphQLAdapter } from './graphql-adapter';

describe('graphql', () => {
	it('maps state to offset/limit variables by default', () => {
		const a = createGraphQLAdapter<string>({
			endpoint: '/graphql',
			query: 'q',
			fetchFn: async () => ({ rows: [], total: 0 }),
		});
		expect(
			a.buildQuery({
				page: 1,
				pageSize: 10,
				sorting: [{ id: 'email', desc: false }],
				filters: [{ id: 'email', value: 'a' }],
			}),
		).toEqual({
			offset: 10,
			limit: 10,
			orderBy: [{ email: 'ASC' }],
			where: { email: { contains: 'a' } },
		});
	});
	it('supports cursor mode', () => {
		const a = createGraphQLAdapter<string>({
			endpoint: '/g',
			query: 'q',
			mode: 'cursor',
			fetchFn: async () => ({ rows: [], total: 0 }),
		});
		expect(a.buildQuery({ page: 0, pageSize: 5, sorting: [], filters: [] }).first).toBe(5);
	});
	it('propagates fetch errors so helm can keep previous rows', async () => {
		const a = createGraphQLAdapter<string>({
			endpoint: '/g',
			query: 'q',
			fetchFn: async () => {
				throw new Error('boom');
			},
		});
		await expect(a.fetch({ offset: 0, limit: 10 }, new AbortController().signal)).rejects.toThrow('boom');
	});
});
