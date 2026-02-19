import {
	buildBooleanField,
	buildComboField,
	buildComboFieldAsync,
	buildDateField,
	buildDateRangeField,
	buildNumberField,
	buildRangeField,
	buildSelectField,
	buildTextField,
	buildTimeField,
	fieldBuilder,
} from './builders';
import { EqualityOperators, IdentityOperators, Operators, TextOperators, TimeOperators } from './operators';
import { FieldTypes } from './types';

// ─── fieldBuilder map ───────────────────────────────────────────────

describe('fieldBuilder', () => {
	it('should have an entry for every FieldType', () => {
		for (const type of Object.values(FieldTypes)) {
			expect(fieldBuilder[type]).toBeDefined();
			expect(typeof fieldBuilder[type]).toBe('function');
		}
	});
});

// ─── buildTextField ──────────────────────────────────────────────────

describe('buildTextField', () => {
	it('should produce the correct __type', () => {
		const f = buildTextField('q', '', TextOperators.includes);
		expect(f.__type).toBe(FieldTypes.text);
	});

	it('should store id, value, operator', () => {
		const f = buildTextField('q', 'hello', TextOperators.startsWith);
		expect(f.id).toBe('q');
		expect(f.value).toBe('hello');
		expect(f.operator).toBe(TextOperators.startsWith);
	});

	it('should default __visible to false', () => {
		expect(buildTextField('q', '', TextOperators.includes).__visible).toBe(false);
	});

	it('should set __visible when initialVisible is true', () => {
		expect(buildTextField('q', '', TextOperators.includes, { initialVisible: true }).__visible).toBe(true);
	});

	it('should default __required to false', () => {
		expect(buildTextField('q', '', TextOperators.includes).__required).toBe(false);
	});

	it('should set __required when true', () => {
		expect(buildTextField('q', '', TextOperators.includes, { required: true }).__required).toBe(true);
	});

	it('should store __placeholder', () => {
		expect(buildTextField('q', '', TextOperators.includes, { placeholder: 'Type...' }).__placeholder).toBe('Type...');
	});

	it('should store __label', () => {
		expect(buildTextField('q', '', TextOperators.includes, { label: 'Search' }).__label).toBe('Search');
	});

	it('should store __reset equal to initial value', () => {
		expect(buildTextField('q', 'init', TextOperators.includes).__reset).toBe('init');
	});

	it('should initialise __index to 0', () => {
		expect(buildTextField('q', '', TextOperators.includes).__index).toBe(0);
	});
});

// ─── buildNumberField ───────────────────────────────────────────────

describe('buildNumberField', () => {
	it('should produce the correct __type', () => {
		expect(buildNumberField('n', 0, EqualityOperators.equals).__type).toBe(FieldTypes.number);
	});

	it('should store min/max/step when provided', () => {
		const f = buildNumberField('n', 5, EqualityOperators.equals, { min: 1, max: 99, step: 2 });
		expect(f.__min).toBe(1);
		expect(f.__max).toBe(99);
		expect(f.__step).toBe(2);
	});

	it('should leave min/max/step undefined when not provided', () => {
		const f = buildNumberField('n', 0, EqualityOperators.equals);
		expect(f.__min).toBeUndefined();
		expect(f.__max).toBeUndefined();
		expect(f.__step).toBeUndefined();
	});

	it('should store __label', () => {
		expect(buildNumberField('n', 0, EqualityOperators.equals, { label: 'Qty' }).__label).toBe('Qty');
	});

	it('should store __reset', () => {
		expect(buildNumberField('n', 42, EqualityOperators.equals).__reset).toBe(42);
	});
});

// ─── buildDateField ─────────────────────────────────────────────────

describe('buildDateField', () => {
	const d = new Date('2024-06-15');

	it('should produce the correct __type', () => {
		expect(buildDateField('d', d, TimeOperators.past).__type).toBe(FieldTypes.date);
	});

	it('should store min and max dates', () => {
		const min = new Date('2024-01-01');
		const max = new Date('2024-12-31');
		const f = buildDateField('d', d, TimeOperators.at, { min, max });
		expect(f.__min).toEqual(min);
		expect(f.__max).toEqual(max);
	});

	it('should leave min/max undefined when not provided', () => {
		const f = buildDateField('d', d, TimeOperators.at);
		expect(f.__min).toBeUndefined();
		expect(f.__max).toBeUndefined();
	});

	it('should store __reset as the initial date', () => {
		expect(buildDateField('d', d, TimeOperators.at).__reset).toEqual(d);
	});
});

// ─── buildTimeField ─────────────────────────────────────────────────

describe('buildTimeField', () => {
	const t = new Date('2024-06-15T14:30:00');

	it('should produce the correct __type', () => {
		expect(buildTimeField('t', t, TimeOperators.at).__type).toBe(FieldTypes.time);
	});

	it('should store min/max dates', () => {
		const min = new Date('2024-06-15T08:00:00');
		const max = new Date('2024-06-15T20:00:00');
		const f = buildTimeField('t', t, TimeOperators.at, { min, max });
		expect(f.__min).toEqual(min);
		expect(f.__max).toEqual(max);
	});

	it('should store __label', () => {
		expect(buildTimeField('t', t, TimeOperators.at, { label: 'Alarm' }).__label).toBe('Alarm');
	});
});

// ─── buildSelectField ───────────────────────────────────────────────

describe('buildSelectField', () => {
	const opts = [
		{ label: 'Red', value: 'red' },
		{ label: 'Blue', value: 'blue' },
	];

	it('should produce the correct __type', () => {
		expect(buildSelectField('s', null, IdentityOperators.is, { options: opts }).__type).toBe(FieldTypes.select);
	});

	it('should store __options', () => {
		expect(buildSelectField('s', null, IdentityOperators.is, { options: opts }).__options).toEqual(opts);
	});

	it('should default __itemToString to String()', () => {
		const f = buildSelectField('s', null, IdentityOperators.is, { options: opts });
		expect(f.__itemToString('hello')).toBe('hello');
		expect(f.__itemToString(null)).toBe('');
	});

	it('should use custom itemToString when provided', () => {
		const f = buildSelectField('s', null, IdentityOperators.is, {
			options: opts,
			itemToString: (v) => `custom-${v}`,
		});
		expect(f.__itemToString('x')).toBe('custom-x');
	});

	it('should accept null as initial value', () => {
		expect(buildSelectField('s', null, IdentityOperators.is, { options: opts }).value).toBeNull();
	});
});

// ─── buildComboField ────────────────────────────────────────────────

describe('buildComboField', () => {
	const opts = [{ label: 'A', value: 'a' }];

	it('should produce the correct __type', () => {
		expect(buildComboField('c', '', IdentityOperators.is, { options: opts }).__type).toBe(FieldTypes.combobox);
	});

	it('should store __placeholder', () => {
		const f = buildComboField('c', '', IdentityOperators.is, { options: opts, placeholder: 'Search...' });
		expect(f.__placeholder).toBe('Search...');
	});

	it('should store __options', () => {
		expect(buildComboField('c', '', IdentityOperators.is, { options: opts }).__options).toEqual(opts);
	});
});

// ─── buildComboFieldAsync ───────────────────────────────────────────

describe('buildComboFieldAsync', () => {
	const resourceRequest = { url: 'https://api.test/items' };
	const resourceOptions = { defaultValue: [] as string[] };

	it('should produce the correct __type', () => {
		const f = buildComboFieldAsync('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
		});
		expect(f.__type).toBe(FieldTypes.asyncCombobox);
	});

	it('should store __resourceRequest', () => {
		const f = buildComboFieldAsync('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
		});
		expect(f.__resourceRequest).toEqual(resourceRequest);
	});

	it('should store __resourceOptions', () => {
		const f = buildComboFieldAsync('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
		});
		expect(f.__resourceOptions).toEqual(resourceOptions);
	});

	it('should default __itemToString to String()', () => {
		const f = buildComboFieldAsync('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
		});
		expect(f.__itemToString('foo')).toBe('foo');
	});

	it('should use custom itemToString when provided', () => {
		const f = buildComboFieldAsync<string[]>('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
			itemToString: (v) => v.toUpperCase(),
		});
		expect(f.__itemToString('foo')).toBe('FOO');
	});

	it('should store __placeholder', () => {
		const f = buildComboFieldAsync('ca', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
			placeholder: 'Type...',
		});
		expect(f.__placeholder).toBe('Type...');
	});
});

// ─── buildBooleanField ──────────────────────────────────────────────

describe('buildBooleanField', () => {
	it('should produce the correct __type', () => {
		expect(buildBooleanField('b', true).__type).toBe(FieldTypes.boolean);
	});

	it('should always use Operators.is', () => {
		expect(buildBooleanField('b', true).operator).toBe(Operators.is);
		expect(buildBooleanField('b', false).operator).toBe(Operators.is);
		expect(buildBooleanField('b', null).operator).toBe(Operators.is);
	});

	it('should accept null value', () => {
		expect(buildBooleanField('b', null).value).toBeNull();
	});

	it('should store __reset', () => {
		expect(buildBooleanField('b', false).__reset).toBe(false);
	});
});

// ─── buildRangeField ────────────────────────────────────────────────

describe('buildRangeField', () => {
	it('should produce the correct __type', () => {
		expect(buildRangeField('r', [0, 50], Operators.between).__type).toBe(FieldTypes.range);
	});

	it('should default __min to 0 and __max to 100', () => {
		const f = buildRangeField('r', [0, 50], Operators.between);
		expect(f.__min).toBe(0);
		expect(f.__max).toBe(100);
	});

	it('should accept custom min/max', () => {
		const f = buildRangeField('r', [10, 90], Operators.between, { min: 5, max: 200 });
		expect(f.__min).toBe(5);
		expect(f.__max).toBe(200);
	});

	it('should store tuple value', () => {
		expect(buildRangeField('r', [20, 80], Operators.between).value).toEqual([20, 80]);
	});

	it('should store __reset as the tuple', () => {
		expect(buildRangeField('r', [10, 40], Operators.between).__reset).toEqual([10, 40]);
	});
});

// ─── buildDateRangeField ────────────────────────────────────────────

describe('buildDateRangeField', () => {
	const s = new Date('2024-01-01');
	const e = new Date('2024-06-30');

	it('should produce the correct __type', () => {
		expect(buildDateRangeField('dr', { start: s, end: e }, Operators.between).__type).toBe(FieldTypes.daterange);
	});

	it('should store start/end in value', () => {
		const f = buildDateRangeField('dr', { start: s, end: e }, Operators.between);
		expect(f.value).toEqual({ start: s, end: e });
	});

	it('should store min/max dates when provided', () => {
		const min = new Date('2023-01-01');
		const max = new Date('2025-12-31');
		const f = buildDateRangeField('dr', { start: s, end: e }, Operators.between, { min, max });
		expect(f.__min).toEqual(min);
		expect(f.__max).toEqual(max);
	});

	it('should leave min/max undefined when not provided', () => {
		const f = buildDateRangeField('dr', { start: s, end: e }, Operators.between);
		expect(f.__min).toBeUndefined();
		expect(f.__max).toBeUndefined();
	});
});
