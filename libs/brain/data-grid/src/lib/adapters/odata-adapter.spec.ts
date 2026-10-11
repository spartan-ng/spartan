import { describe, expect, it } from 'vitest';
import { buildODataQueryString } from './odata-adapter';

describe('odata', () => {
	it('escapes single quotes and maps sort/filter', () => {
		expect(
			buildODataQueryString({
				page: 2,
				pageSize: 10,
				sorting: [{ id: 'email', desc: true }],
				filters: [{ id: 'email', value: "o'h" }],
			}),
		).toBe(`$top=10&$skip=20&$orderby=email desc&$filter=contains(email,'o''h')&$count=true`);
	});
	it('empty state omits orderby/filter', () => {
		expect(buildODataQueryString({ page: 0, pageSize: 10, sorting: [], filters: [] })).toBe(
			`$top=10&$skip=0&$count=true`,
		);
	});
});
