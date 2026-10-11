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
		).toBe(`$top=10&$skip=20&$orderby=email desc&$filter=${encodeURIComponent(`contains(email,'o''h')`)}&$count=true`);
	});
	it('empty state omits orderby/filter', () => {
		expect(buildODataQueryString({ page: 0, pageSize: 10, sorting: [], filters: [] })).toBe(
			`$top=10&$skip=0&$count=true`,
		);
	});
	it('percent-encodes filter values so &?%# cannot split the query', () => {
		const qs = buildODataQueryString({
			page: 0,
			pageSize: 10,
			sorting: [],
			filters: [{ id: 'email', value: 'a&b#c?d%e' }],
		});
		const params = new URLSearchParams(qs);
		expect(params.get('$filter')).toBe(`contains(email,'a&b#c?d%e')`);
		expect(params.get('$count')).toBe('true');
		expect(qs.split('&').filter((p) => p.startsWith('$filter='))).toHaveLength(1);
	});
});
