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

import type { RFilterField } from './builders';

/** Helper to patch a single field inside a FilterModelRef.value signal (avoids discriminated-union spread issues) */
function patchField(model: ReturnType<typeof buildFilterModel>, id: string, patch: Partial<RFilterField>) {
	model.value.update((s: Record<string, RFilterField>) => ({ ...s, [id]: { ...s[id], ...patch } }) as typeof s);
}

// ─── filterParser ───────────────────────────────────────────────────

describe('filterParser', () => {
	it('should strip private fields (those starting with __)', () => {
		const filter = buildFilterModel(buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }));

		const parsed = filterParser(filter.value());
		const entry = parsed['name'];

		expect(entry).toBeDefined();
		expect(entry.id).toBe('name');
		expect(entry.value).toBe('Alice');
		expect(entry.operator).toBe(TextOperators.includes);
		expect(Object.keys(entry).some((k) => k.startsWith('__'))).toBe(false);
	});

	it('should exclude fields with null value', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildNumberField('age', 0, EqualityOperators.equals, { initialVisible: true }),
		);
		// Patch via signal since patchValue is internal-only
		patchField(filter, 'age', { value: null as unknown as number });

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['age']).toBeUndefined();
	});

	it('should exclude non-visible fields', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildTextField('email', 'alice@example.com', TextOperators.includes, { initialVisible: false }),
		);

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['email']).toBeUndefined();
	});

	it('should return empty object when all fields are hidden', () => {
		const filter = buildFilterModel(buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: false }));
		expect(Object.keys(filterParser(filter.value()))).toHaveLength(0);
	});

	it('should return empty object when all values are null', () => {
		const filter = buildFilterModel(buildTextField('name', '', TextOperators.includes, { initialVisible: true }));
		patchField(filter, 'name', { value: null as unknown as string });

		expect(Object.keys(filterParser(filter.value()))).toHaveLength(0);
	});

	it('should include fields with falsy but non-null values', () => {
		const filter = buildFilterModel(
			buildTextField('name', '', TextOperators.includes, { initialVisible: true }),
			buildNumberField('count', 0, EqualityOperators.equals, { initialVisible: true }),
		);

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['name'].value).toBe('');
		expect(parsed['count']).toBeDefined();
		expect(parsed['count'].value).toBe(0);
	});

	it('should handle multiple field types simultaneously', () => {
		const filter = buildFilterModel(
			buildTextField('search', 'test', TextOperators.includes, { initialVisible: true }),
			buildNumberField('qty', 42, EqualityOperators.greaterThan, { initialVisible: true }),
			buildBooleanField('active', true, { initialVisible: true }),
		);

		const parsed = filterParser(filter.value());
		expect(Object.keys(parsed)).toHaveLength(3);
		expect(parsed['search'].operator).toBe(TextOperators.includes);
		expect(parsed['qty'].operator).toBe(EqualityOperators.greaterThan);
		expect(parsed['active'].operator).toBe(Operators.is);
	});
});

// ─── buildFilterModel ───────────────────────────────────────────────

describe('buildFilterModel', () => {
	const createTestModel = () =>
		buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildNumberField('age', 25, EqualityOperators.equals, { initialVisible: false }),
			buildRangeField('price', [10, 100], Operators.between, { initialVisible: false }),
		);

	// ── initial state ──

	it('should store correct initial values accessible via value signal', () => {
		const model = createTestModel();
		expect(model.value()['name'].value).toBe('Alice');
		expect(model.value()['age'].value).toBe(25);
		expect(model.value()['price'].value).toEqual([10, 100]);
	});

	it('should return only visible fields in fieldsArray', () => {
		const model = createTestModel();
		const visible = model.fieldsArray();
		expect(visible).toHaveLength(1);
		expect(visible[0].id).toBe('name');
	});

	it('should return non-visible fields in availableFields', () => {
		const model = createTestModel();
		const available = model.availableFields();
		expect(available).toHaveLength(2);
		expect(available.map((f) => f.id)).toEqual(expect.arrayContaining(['age', 'price']));
	});

	// ── value patching via signal ──

	describe('value mutation via signal', () => {
		it('should update a field value through the value signal', () => {
			const model = createTestModel();
			patchField(model, 'name', { value: 'Bob' });
			expect(model.value()['name'].value).toBe('Bob');
		});

		it('should update a field operator through the value signal', () => {
			const model = createTestModel();
			patchField(model, 'name', { operator: TextOperators.startsWith });
			expect(model.value()['name'].operator).toBe(TextOperators.startsWith);
		});

		it('should reflect value changes in filterParser output', () => {
			const model = createTestModel();
			patchField(model, 'name', { value: 'Updated' });

			const parsed = filterParser(model.value());
			expect(parsed['name'].value).toBe('Updated');
		});
	});

	// ── addField ──

	describe('addField', () => {
		it('should make a hidden field visible', () => {
			const model = createTestModel();
			expect(model.fieldsArray().find((f) => f.id === 'age')).toBeUndefined();

			model.addField('age');

			expect(model.fieldsArray().find((f) => f.id === 'age')).toBeDefined();
		});

		it('should add field to end of visible list', () => {
			const model = createTestModel();
			model.addField('age');
			const arr = model.fieldsArray();
			expect(arr[arr.length - 1].id).toBe('age');
		});

		it('should preserve existing visible fields when adding', () => {
			const model = createTestModel();
			model.addField('age');
			model.addField('price');

			const ids = model.fieldsArray().map((f) => f.id);
			expect(ids).toContain('name');
			expect(ids).toContain('age');
			expect(ids).toContain('price');
		});

		it('should be a no-op for unknown field ids', () => {
			const model = createTestModel();
			const before = model.fieldsArray().length;
			model.addField('nonexistent');
			expect(model.fieldsArray().length).toBe(before);
		});
	});

	// ── clear ──

	describe('clear', () => {
		it('should hide all fields', () => {
			const model = createTestModel();
			model.addField('age');
			expect(model.fieldsArray().length).toBeGreaterThan(0);

			model.clear();

			expect(model.fieldsArray()).toHaveLength(0);
		});

		it('should make previously visible fields available again', () => {
			const model = createTestModel();
			model.clear();
			const ids = model.availableFields().map((f) => f.id);
			expect(ids).toContain('name');
			expect(ids).toContain('age');
			expect(ids).toContain('price');
		});
	});

	// ── reset ──

	describe('reset', () => {
		it('should restore all fields to initial state', () => {
			const model = createTestModel();
			patchField(model, 'name', { value: 'Changed' });
			model.clear();

			model.reset();

			expect(model.value()['name'].value).toBe('Alice');
			expect(model.fieldsArray().find((f) => f.id === 'name')).toBeDefined();
		});

		it('should restore visibility to initial state', () => {
			const model = createTestModel();
			model.addField('age');
			expect(model.fieldsArray().map((f) => f.id)).toContain('age');

			model.reset();

			// age was initially hidden
			expect(model.fieldsArray().find((f) => f.id === 'age')).toBeUndefined();
		});
	});

	// ── field builder coverage ──

	describe('field builders', () => {
		it('should build text fields with required and placeholder', () => {
			const model = buildFilterModel(
				buildTextField('q', '', TextOperators.includes, { required: true, placeholder: 'Search...' }),
			);
			const field = model.value()['q'];
			expect(field.__type).toBe('text');
			expect(field.__required).toBe(true);
			expect(field.__placeholder).toBe('Search...');
		});

		it('should build number fields with min/max/step', () => {
			const model = buildFilterModel(
				buildNumberField('count', 5, EqualityOperators.equals, { min: 0, max: 100, step: 5 }),
			);
			const field = model.value()['count'];
			expect(field.__type).toBe('number');
			expect(field.__min).toBe(0);
			expect(field.__max).toBe(100);
			expect(field.__step).toBe(5);
		});

		it('should build boolean fields with fixed "is" operator', () => {
			const model = buildFilterModel(buildBooleanField('active', true));
			const field = model.value()['active'];
			expect(field.__type).toBe('boolean');
			expect(field.operator).toBe(Operators.is);
		});

		it('should build range fields with tuple value', () => {
			const model = buildFilterModel(buildRangeField('price', [0, 50], Operators.between));
			const field = model.value()['price'];
			expect(field.__type).toBe('range');
			expect(field.value).toEqual([0, 50]);
			expect(field.__min).toBe(0);
			expect(field.__max).toBe(100);
		});

		it('should build date fields with min/max', () => {
			const min = new Date('2024-01-01');
			const max = new Date('2024-12-31');
			const model = buildFilterModel(buildDateField('start', new Date('2024-06-15'), TimeOperators.past, { min, max }));
			const field = model.value()['start'];
			expect(field.__type).toBe('date');
			expect(field.__min).toEqual(min);
			expect(field.__max).toEqual(max);
		});

		it('should build time fields', () => {
			const now = new Date();
			const model = buildFilterModel(buildTimeField('alarm', now, TimeOperators.at, { label: 'Alarm' }));
			const field = model.value()['alarm'];
			expect(field.__type).toBe('time');
			expect(field.operator).toBe(TimeOperators.at);
			expect(field.__label).toBe('Alarm');
		});

		it('should build date range fields', () => {
			const s = new Date('2024-01-01');
			const e = new Date('2024-06-30');
			const model = buildFilterModel(buildDateRangeField('period', { start: s, end: e }, Operators.between));
			const field = model.value()['period'];
			expect(field.__type).toBe('daterange');
			expect(field.value).toEqual({ start: s, end: e });
		});

		it('should build select fields with options', () => {
			const opts = [
				{ label: 'Red', value: 'red' },
				{ label: 'Blue', value: 'blue' },
			];
			const model = buildFilterModel(buildSelectField('color', null, IdentityOperators.is, { options: opts }));
			const field = model.value()['color'];
			expect(field.__type).toBe('select');
			expect(field.__options).toEqual(opts);
		});

		it('should build combobox fields with placeholder', () => {
			const model = buildFilterModel(
				buildComboField('tag', '', IdentityOperators.is, {
					options: [{ label: 'A', value: 'a' }],
					placeholder: 'Pick...',
				}),
			);
			const field = model.value()['tag'];
			expect(field.__type).toBe('combobox');
			expect(field.__placeholder).toBe('Pick...');
		});

		it('should store __reset for each builder', () => {
			const model = buildFilterModel(
				buildTextField('t', 'hello', TextOperators.includes),
				buildNumberField('n', 42, EqualityOperators.equals),
				buildBooleanField('b', false),
			);
			expect(model.value()['t'].__reset).toBe('hello');
			expect(model.value()['n'].__reset).toBe(42);
			expect(model.value()['b'].__reset).toBe(false);
		});

		it('should store custom labels via __label', () => {
			const model = buildFilterModel(
				buildTextField('q', '', TextOperators.includes, { label: 'Search' }),
				buildNumberField('qty', 0, EqualityOperators.equals, { label: 'Quantity' }),
			);
			expect(model.value()['q'].__label).toBe('Search');
			expect(model.value()['qty'].__label).toBe('Quantity');
		});
	});
});
