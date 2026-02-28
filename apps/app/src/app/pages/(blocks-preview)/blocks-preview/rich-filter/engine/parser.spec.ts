import type { RFilterField } from './builders';
import {
	buildBooleanField,
	buildComboField,
	buildDateField,
	buildDateRangeField,
	buildFilterModel,
	buildNumberField,
	buildRangeField,
	buildSelectField,
	buildTextField,
	buildTimeField,
} from './builders';
import { EqualityOperators, IdentityOperators, Operators, TextOperators, TimeOperators } from './operators';
import { filterParser } from './parser';

/** Helper to patch a field in the model value signal */
function patchField(model: ReturnType<typeof buildFilterModel>, id: string, patch: Partial<RFilterField>) {
	model.value.update((s: Record<string, RFilterField>) => ({ ...s, [id]: { ...s[id], ...patch } }) as typeof s);
}

describe('filterParser', () => {
	// ── output shape ──

	it('should return only id, value, operator for each visible non-null field', () => {
		const model = buildFilterModel(buildTextField('q', 'hello', TextOperators.includes, { initialVisible: true }));
		const parsed = filterParser(model.value());
		expect(Object.keys(parsed['q']).sort()).toEqual(['id', 'operator', 'value']);
	});

	it('should never leak private (__ prefixed) properties', () => {
		const model = buildFilterModel(
			buildTextField('q', 'x', TextOperators.includes, { initialVisible: true, label: 'Search', required: true }),
		);
		const parsed = filterParser(model.value());
		for (const key of Object.keys(parsed['q'])) {
			expect(key.startsWith('__')).toBe(false);
		}
	});

	// ── visibility filtering ──

	it('should include visible fields', () => {
		const model = buildFilterModel(buildTextField('a', 'v', TextOperators.includes, { initialVisible: true }));
		expect(filterParser(model.value())['a']).toBeDefined();
	});

	it('should exclude hidden fields', () => {
		const model = buildFilterModel(buildTextField('a', 'v', TextOperators.includes, { initialVisible: false }));
		expect(filterParser(model.value())['a']).toBeUndefined();
	});

	// ── null/undefined filtering ──

	it('should exclude fields with null value', () => {
		const model = buildFilterModel(buildTextField('a', 'v', TextOperators.includes, { initialVisible: true }));
		patchField(model, 'a', { value: null as unknown as string });
		expect(filterParser(model.value())['a']).toBeUndefined();
	});

	it('should exclude fields with undefined value', () => {
		const model = buildFilterModel(buildTextField('a', 'v', TextOperators.includes, { initialVisible: true }));
		patchField(model, 'a', { value: undefined as unknown as string });
		expect(filterParser(model.value())['a']).toBeUndefined();
	});

	// ── falsy but valid values ──

	it('should include empty string', () => {
		const model = buildFilterModel(buildTextField('a', '', TextOperators.includes, { initialVisible: true }));
		expect(filterParser(model.value())['a']).toBeDefined();
		expect(filterParser(model.value())['a'].value).toBe('');
	});

	it('should include zero', () => {
		const model = buildFilterModel(buildNumberField('n', 0, EqualityOperators.equals, { initialVisible: true }));
		expect(filterParser(model.value())['n']).toBeDefined();
		expect(filterParser(model.value())['n'].value).toBe(0);
	});

	it('should include false', () => {
		const model = buildFilterModel(buildBooleanField('b', false, { initialVisible: true }));
		expect(filterParser(model.value())['b']).toBeDefined();
		expect(filterParser(model.value())['b'].value).toBe(false);
	});

	// ── multiple field types ──

	it('should handle a mix of field types', () => {
		const now = new Date();
		const model = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildNumberField('age', 30, EqualityOperators.greaterThan, { initialVisible: true }),
			buildBooleanField('active', true, { initialVisible: true }),
			buildDateField('created', now, TimeOperators.past, { initialVisible: true }),
			buildRangeField('price', [10, 50], Operators.between, { initialVisible: true }),
		);

		const parsed = filterParser(model.value());
		expect(Object.keys(parsed)).toHaveLength(5);
		expect(parsed['name'].value).toBe('Alice');
		expect(parsed['age'].value).toBe(30);
		expect(parsed['active'].value).toBe(true);
		expect(parsed['created'].value).toEqual(now);
		expect(parsed['price'].value).toEqual([10, 50]);
	});

	// ── edge cases ──

	it('should return empty object when model has no fields', () => {
		const model = buildFilterModel();
		expect(filterParser(model.value())).toEqual({});
	});

	it('should return empty object when all fields are hidden', () => {
		const model = buildFilterModel(
			buildTextField('a', 'v', TextOperators.includes, { initialVisible: false }),
			buildNumberField('b', 1, EqualityOperators.equals, { initialVisible: false }),
		);
		expect(Object.keys(filterParser(model.value()))).toHaveLength(0);
	});

	it('should return empty object when all values are null', () => {
		const model = buildFilterModel(
			buildTextField('a', '', TextOperators.includes, { initialVisible: true }),
			buildNumberField('b', 0, EqualityOperators.equals, { initialVisible: true }),
		);
		patchField(model, 'a', { value: null as unknown as string });
		patchField(model, 'b', { value: null as unknown as number });
		expect(Object.keys(filterParser(model.value()))).toHaveLength(0);
	});

	it('should preserve the correct operator per field', () => {
		const model = buildFilterModel(
			buildTextField('a', 'v', TextOperators.startsWith, { initialVisible: true }),
			buildNumberField('b', 5, EqualityOperators.lessThan, { initialVisible: true }),
			buildTimeField('c', new Date(), TimeOperators.before, { initialVisible: true }),
		);
		const parsed = filterParser(model.value());
		expect(parsed['a'].operator).toBe(TextOperators.startsWith);
		expect(parsed['b'].operator).toBe(EqualityOperators.lessThan);
		expect(parsed['c'].operator).toBe(TimeOperators.before);
	});

	// ── select / combo ──

	it('should parse select fields correctly', () => {
		const opts = [{ label: 'Red', value: 'red' }];
		const model = buildFilterModel(
			buildSelectField('color', 'red', IdentityOperators.is, { options: opts, initialVisible: true }),
		);
		const parsed = filterParser(model.value());
		expect(parsed['color'].value).toBe('red');
		expect(parsed['color'].operator).toBe(IdentityOperators.is);
	});

	it('should exclude select field with null value', () => {
		const opts = [{ label: 'Red', value: 'red' }];
		const model = buildFilterModel(
			buildSelectField('color', null, IdentityOperators.is, { options: opts, initialVisible: true }),
		);
		expect(filterParser(model.value())['color']).toBeUndefined();
	});

	it('should parse date range fields', () => {
		const s = new Date('2024-01-01');
		const e = new Date('2024-06-30');
		const model = buildFilterModel(
			buildDateRangeField('period', { start: s, end: e }, Operators.between, { initialVisible: true }),
		);
		const parsed = filterParser(model.value());
		expect(parsed['period'].value).toEqual({ start: s, end: e });
	});

	it('should parse combo fields', () => {
		const model = buildFilterModel(
			buildComboField('tag', 'a', IdentityOperators.is, {
				options: [{ label: 'A', value: 'a' }],
				initialVisible: true,
			}),
		);
		const parsed = filterParser(model.value());
		expect(parsed['tag'].value).toBe('a');
	});
});
