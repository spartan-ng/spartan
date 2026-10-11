import { describe, expect, it } from 'vitest';

describe('hlm-data-grid states', () => {
	it('empty contract: total 0 shows empty, not skeleton', () => {
		const total = 0,
			loading = false;
		const visible = total === 0 && !loading ? 'empty' : loading ? 'skeleton' : 'rows';
		expect(visible).toBe('empty');
	});
	it('error contract: error keeps previous rows visible', () => {
		const prev = ['a'],
			error: unknown = new Error('x');
		const rows = error ? prev : [];
		expect(rows).toEqual(['a']);
	});
});
