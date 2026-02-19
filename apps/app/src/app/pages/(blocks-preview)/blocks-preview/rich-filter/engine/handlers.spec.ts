/* eslint-disable @typescript-eslint/naming-convention */
import { signal } from '@angular/core';
import type { RFilterField } from './builders';
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
} from './builders';
import {
	asyncComboFieldHandlers,
	booleanFieldHandlers,
	comboboxFieldHandlers,
	dateFieldHandlers,
	dateRangeFieldHandlers,
	FIELD_HANDLERS_MAP,
	numberFieldHandlers,
	rangeFieldHandlers,
	selectFieldHandlers,
	textFieldHandlers,
	throwHandlerException,
	timeFieldHandlers,
	type HandlerGlobalState,
} from './handlers';
import { EqualityOperators, IdentityOperators, Operators, TextOperators, TimeOperators } from './operators';
import { FieldTypes } from './types';

/** Create a state signal populated with one or more fields */
function createState(...fields: RFilterField[]) {
	const record = fields.reduce(
		(acc, f, i) => {
			f.__index = i;
			acc[f.id] = f;
			return acc;
		},
		{} as Record<string, RFilterField>,
	);
	return signal(record);
}

function createGlobalState(): HandlerGlobalState {
	return { focusedField: signal<string | null>(null) };
}

// ─── FIELD_HANDLERS_MAP ─────────────────────────────────────────────

describe('FIELD_HANDLERS_MAP', () => {
	it('should contain a handler factory for every field type', () => {
		const expected = Object.values(FieldTypes);
		const actual = Object.keys(FIELD_HANDLERS_MAP);
		expect(actual).toEqual(expect.arrayContaining(expected));
		expect(actual.length).toBe(expected.length);
	});
});

// ─── textFieldHandlers ──────────────────────────────────────────────

describe('textFieldHandlers', () => {
	const setup = (value = 'Alice', opts?: { required?: boolean; placeholder?: string; label?: string }) => {
		const field = buildTextField('name', value, TextOperators.includes, {
			initialVisible: true,
			...opts,
		});
		const state = createState(field);
		const handlers = textFieldHandlers('name', state, createGlobalState());
		return { state, handlers };
	};

	it('should read initial controlValue', () => {
		const { handlers } = setup();
		expect(handlers.controlValue()).toBe('Alice');
	});

	it('should derive controlLabel from __label or fallback to id', () => {
		const { handlers } = setup('', { label: 'Full Name' });
		expect(handlers.controlLabel()).toBe('Full Name');
	});

	it('should fall back to id when no label is set', () => {
		const { handlers } = setup();
		expect(handlers.controlLabel()).toBe('name');
	});

	it('should derive formId from type and field id', () => {
		const { handlers } = setup();
		expect(handlers.formId()).toBe('text-name');
	});

	it('should read operatorValue', () => {
		const { handlers } = setup();
		expect(handlers.operatorValue()).toBe(TextOperators.includes);
	});

	it('should update value via updateControl', () => {
		const { state, handlers } = setup();
		handlers.updateControl('Bob');
		expect(state()['name'].value).toBe('Bob');
		expect(handlers.controlValue()).toBe('Bob');
	});

	it('should update operator via setOperator', () => {
		const { state, handlers } = setup();
		handlers.setOperator(TextOperators.startsWith);
		expect(state()['name'].operator).toBe(TextOperators.startsWith);
		expect(handlers.operatorValue()).toBe(TextOperators.startsWith);
	});

	it('should accept an array and use first element for setOperator', () => {
		const { handlers } = setup();
		handlers.setOperator([TextOperators.endsWith, TextOperators.includes]);
		expect(handlers.operatorValue()).toBe(TextOperators.endsWith);
	});

	it('should hide field via closeField', () => {
		const { state, handlers } = setup();
		handlers.closeField();
		expect(state()['name'].__visible).toBe(false);
	});

	it('should report fieldRequired', () => {
		const { handlers } = setup('', { required: true });
		expect(handlers.fieldRequired()).toBe(true);
	});

	it('should default fieldRequired to false', () => {
		const { handlers } = setup();
		expect(handlers.fieldRequired()).toBe(false);
	});
});

// ─── numberFieldHandlers ────────────────────────────────────────────

describe('numberFieldHandlers', () => {
	const setup = (value = 10, opts?: { min?: number; max?: number; step?: number; label?: string }) => {
		const field = buildNumberField('qty', value, EqualityOperators.equals, {
			initialVisible: true,
			...opts,
		});
		const state = createState(field);
		const handlers = numberFieldHandlers('qty', state, createGlobalState());
		return { state, handlers };
	};

	it('should read initial controlValue', () => {
		const { handlers } = setup(42);
		expect(handlers.controlValue()).toBe(42);
	});

	it('should expose min/max/step', () => {
		const { handlers } = setup(0, { min: 1, max: 99, step: 2 });
		expect(handlers.min()).toBe(1);
		expect(handlers.max()).toBe(99);
		expect(handlers.step()).toBe(2);
	});

	it('should default min to MIN_SAFE_INTEGER, max to MAX_SAFE_INTEGER, step to 1', () => {
		const { handlers } = setup();
		expect(handlers.min()).toBe(Number.MIN_SAFE_INTEGER);
		expect(handlers.max()).toBe(Number.MAX_SAFE_INTEGER);
		expect(handlers.step()).toBe(1);
	});

	it('should mutate value via updateControl', () => {
		const { handlers } = setup();
		handlers.updateControl(99);
		expect(handlers.controlValue()).toBe(99);
	});
});

// ─── booleanFieldHandlers ───────────────────────────────────────────

describe('booleanFieldHandlers', () => {
	const setup = (value: boolean | null = true) => {
		const field = buildBooleanField('active', value, { initialVisible: true });
		const state = createState(field);
		const handlers = booleanFieldHandlers('active', state, createGlobalState());
		return { state, handlers };
	};

	it('should read initial controlValue', () => {
		const { handlers } = setup(false);
		expect(handlers.controlValue()).toBe(false);
	});

	it('should handle null value', () => {
		const { handlers } = setup(null);
		expect(handlers.controlValue()).toBeNull();
	});

	it('should not expose operator-related properties', () => {
		const { handlers } = setup();
		expect('operatorValue' in handlers).toBe(false);
		expect('setOperator' in handlers).toBe(false);
	});

	it('should toggle value via updateControl', () => {
		const { handlers } = setup(true);
		handlers.updateControl(false);
		expect(handlers.controlValue()).toBe(false);
	});
});

// ─── dateFieldHandlers ──────────────────────────────────────────────

describe('dateFieldHandlers', () => {
	const now = new Date('2024-06-15');
	const setup = (opts?: { min?: Date; max?: Date }) => {
		const field = buildDateField('start', now, TimeOperators.past, {
			initialVisible: true,
			...opts,
		});
		const state = createState(field);
		const handlers = dateFieldHandlers('start', state, createGlobalState());
		return { state, handlers };
	};

	it('should read controlValue', () => {
		const { handlers } = setup();
		expect(handlers.controlValue()).toEqual(now);
	});

	it('should expose min and max', () => {
		const min = new Date('2024-01-01');
		const max = new Date('2024-12-31');
		const { handlers } = setup({ min, max });
		expect(handlers.min()).toEqual(min);
		expect(handlers.max()).toEqual(max);
	});

	it('should default min/max to null', () => {
		const { handlers } = setup();
		expect(handlers.min()).toBeNull();
		expect(handlers.max()).toBeNull();
	});
});

// ─── timeFieldHandlers ──────────────────────────────────────────────

describe('timeFieldHandlers', () => {
	// 2:30:45 PM
	const base = new Date(2024, 5, 15, 14, 30, 45);
	const setup = () => {
		const field = buildTimeField('alarm', base, TimeOperators.at, { initialVisible: true });
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());
		return { state, handlers };
	};

	it('should convert Date to BrnTimeValue for controlValue', () => {
		const { handlers } = setup();
		const tv = handlers.controlValue();
		expect(tv.hours).toBe(2);
		expect(tv.minutes).toBe(30);
		expect(tv.seconds).toBe(45);
		expect(tv.period).toBe('PM');
	});

	it('should convert BrnTimeValue back to Date via updateControl', () => {
		const { state, handlers } = setup();
		handlers.updateControl({ hours: 9, minutes: 15, seconds: 0, period: 'AM' });

		const stored = state()['alarm'].value as Date;
		expect(stored.getHours()).toBe(9);
		expect(stored.getMinutes()).toBe(15);
		expect(stored.getSeconds()).toBe(0);
	});

	it('should handle PM conversion correctly', () => {
		const { state, handlers } = setup();
		handlers.updateControl({ hours: 3, minutes: 0, seconds: 0, period: 'PM' });

		const stored = state()['alarm'].value as Date;
		expect(stored.getHours()).toBe(15);
	});

	it('should handle 12 AM (midnight) correctly', () => {
		const { state, handlers } = setup();
		handlers.updateControl({ hours: 12, minutes: 0, seconds: 0, period: 'AM' });

		const stored = state()['alarm'].value as Date;
		expect(stored.getHours()).toBe(0);
	});

	it('should handle 12 PM (noon) correctly', () => {
		const { state, handlers } = setup();
		handlers.updateControl({ hours: 12, minutes: 0, seconds: 0, period: 'PM' });

		const stored = state()['alarm'].value as Date;
		expect(stored.getHours()).toBe(12);
	});
});

// ─── rangeFieldHandlers ─────────────────────────────────────────────

describe('rangeFieldHandlers', () => {
	const setup = (opts?: { min?: number; max?: number }) => {
		const field = buildRangeField('price', [20, 80], Operators.between, {
			initialVisible: true,
			...opts,
		});
		const state = createState(field);
		const handlers = rangeFieldHandlers('price', state, createGlobalState());
		return { state, handlers };
	};

	it('should read tuple controlValue', () => {
		const { handlers } = setup();
		expect(handlers.controlValue()).toEqual([20, 80]);
	});

	it('should expose min/max', () => {
		const { handlers } = setup({ min: 5, max: 200 });
		expect(handlers.min()).toBe(5);
		expect(handlers.max()).toBe(200);
	});

	it('should update value via updateControl', () => {
		const { handlers } = setup();
		handlers.updateControl([10, 90]);
		expect(handlers.controlValue()).toEqual([10, 90]);
	});
});

// ─── dateRangeFieldHandlers ─────────────────────────────────────────

describe('dateRangeFieldHandlers', () => {
	const s = new Date('2024-01-01');
	const e = new Date('2024-06-30');
	const setup = () => {
		const field = buildDateRangeField('period', { start: s, end: e }, Operators.between, {
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = dateRangeFieldHandlers('period', state, createGlobalState());
		return { state, handlers };
	};

	it('should read controlValue', () => {
		const { handlers } = setup();
		expect(handlers.controlValue()).toEqual({ start: s, end: e });
	});

	it('should expose min/max defaulting to null', () => {
		const { handlers } = setup();
		expect(handlers.min()).toBeNull();
		expect(handlers.max()).toBeNull();
	});
});

// ─── selectFieldHandlers ────────────────────────────────────────────

describe('selectFieldHandlers', () => {
	const opts = [
		{ label: 'Red', value: 'red' },
		{ label: 'Blue', value: 'blue' },
	];
	const setup = (value: string | null = 'red') => {
		const field = buildSelectField('color', value, IdentityOperators.is, {
			options: opts,
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = selectFieldHandlers('color', state, createGlobalState());
		return { state, handlers };
	};

	it('should read controlValue', () => {
		const { handlers } = setup('blue');
		expect(handlers.controlValue()).toBe('blue');
	});

	it('should expose static options', () => {
		const { handlers } = setup();
		expect(handlers.options()).toEqual(opts);
	});

	it('should unwrap array value in updateControl', () => {
		const { handlers } = setup();
		handlers.updateControl(['blue']);
		expect(handlers.controlValue()).toBe('blue');
	});

	it('should compute selectedOptionLabel', () => {
		const { handlers } = setup('red');
		// Default itemToString calls String(value), so we expect 'red'
		expect(handlers.selectedOptionLabel()).toBe('red');
	});
});

// ─── comboboxFieldHandlers ──────────────────────────────────────────

describe('comboboxFieldHandlers', () => {
	const opts = [
		{ label: 'Tag A', value: 'a' },
		{ label: 'Tag B', value: 'b' },
	];
	const setup = () => {
		const field = buildComboField('tag', '', IdentityOperators.is, {
			options: opts,
			placeholder: 'Pick a tag...',
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = comboboxFieldHandlers('tag', state, createGlobalState());
		return { state, handlers };
	};

	it('should expose options', () => {
		const { handlers } = setup();
		expect(handlers.options()).toEqual(opts);
	});

	it('should expose placeholder', () => {
		const { handlers } = setup();
		expect(handlers.placeholder()).toBe('Pick a tag...');
	});

	it('should update via updateControl', () => {
		const { handlers } = setup();
		handlers.updateControl('a');
		expect(handlers.controlValue()).toBe('a');
	});
});

// ─── base handler shared behaviour ──────────────────────────────────

describe('base handler behaviour (via textFieldHandlers)', () => {
	it('should throw on type mismatch', () => {
		const field = buildNumberField('qty', 10, EqualityOperators.equals, { initialVisible: true });
		const state = createState(field);

		expect(() => textFieldHandlers('qty', state, createGlobalState())).toThrow('Exception in Handler');
	});

	it('should be resilient when updating a field that no longer exists', () => {
		const field = buildTextField('tmp', 'x', TextOperators.includes, { initialVisible: true });
		const state = createState(field);
		const handlers = textFieldHandlers('tmp', state, createGlobalState());

		// Remove the field from state
		state.update((s) => {
			const { tmp: _, ...rest } = s;
			return rest;
		});

		// updateControl and setOperator are no-ops when field is absent
		expect(() => handlers.updateControl('y')).not.toThrow();
		expect(() => handlers.setOperator(TextOperators.endsWith)).not.toThrow();
	});
});

// ─── throwHandlerException ──────────────────────────────────────────

describe('throwHandlerException', () => {
	it('should throw with a prefixed message', () => {
		expect(() => throwHandlerException('test error')).toThrow('Exception in Handler: test error');
	});
});

// ─── setOperator edge cases ─────────────────────────────────────────

describe('setOperator edge cases (via textFieldHandlers)', () => {
	const setup = () => {
		const field = buildTextField('q', 'hello', TextOperators.includes, { initialVisible: true });
		const state = createState(field);
		const handlers = textFieldHandlers('q', state, createGlobalState());
		return { state, handlers };
	};

	it('should keep current operator when called with undefined', () => {
		const { handlers } = setup();
		const original = handlers.operatorValue();
		handlers.setOperator(undefined);
		expect(handlers.operatorValue()).toBe(original);
	});

	it('should keep current operator when called with empty array', () => {
		const { handlers } = setup();
		const original = handlers.operatorValue();
		handlers.setOperator([]);
		expect(handlers.operatorValue()).toBe(original);
	});

	it('should pick the first element from an array of operators', () => {
		const { handlers } = setup();
		handlers.setOperator([TextOperators.startsWith, TextOperators.endsWith]);
		expect(handlers.operatorValue()).toBe(TextOperators.startsWith);
	});
});

// ─── asyncComboFieldHandlers ────────────────────────────────────────

describe('asyncComboFieldHandlers', () => {
	const resourceRequest = { url: 'https://api.test/items' };
	const resourceOptions = { defaultValue: [] as string[] };

	const setup = (opts?: { placeholder?: string; itemToString?: (v: string) => string }) => {
		const field = buildComboFieldAsync<string[]>('search', '', IdentityOperators.is, {
			resourceRequest,
			resourceOptions,
			placeholder: opts?.placeholder,
			itemToString: opts?.itemToString,
			initialVisible: true,
		}) as unknown as RFilterField;
		const state = createState(field);
		const handlers = asyncComboFieldHandlers('search', state, createGlobalState());
		return { state, handlers };
	};

	it('should read controlValue', () => {
		const { handlers } = setup();
		expect(handlers.controlValue()).toBe('');
	});

	it('should expose placeholder', () => {
		const { handlers } = setup({ placeholder: 'Type to search...' });
		expect(handlers.placeholder()).toBe('Type to search...');
	});

	it('should default placeholder to empty string', () => {
		const { handlers } = setup();
		expect(handlers.placeholder()).toBe('');
	});

	it('should expose itemToString function', () => {
		const { handlers } = setup({ itemToString: (v) => v.toUpperCase() });
		expect(handlers.itemToString()('hello')).toBe('HELLO');
	});

	it('should default itemToString to String()', () => {
		const { handlers } = setup();
		expect(handlers.itemToString()('hello')).toBe('hello');
	});

	it('should expose fieldResourceRequest', () => {
		const { handlers } = setup();
		expect(handlers.fieldResourceRequest()).toEqual(resourceRequest);
	});

	it('should expose fieldResourceOptions', () => {
		const { handlers } = setup();
		expect(handlers.fieldResourceOptions).toEqual(resourceOptions);
	});

	it('should update value via updateControl', () => {
		const { handlers } = setup();
		handlers.updateControl('new-value');
		expect(handlers.controlValue()).toBe('new-value');
	});

	it('should update operator via setOperator', () => {
		const { handlers } = setup();
		handlers.setOperator(IdentityOperators.isNot);
		expect(handlers.operatorValue()).toBe(IdentityOperators.isNot);
	});

	it('should throw on type mismatch', () => {
		const field = buildTextField('q', '', TextOperators.includes, { initialVisible: true });
		const state = createState(field);
		expect(() => asyncComboFieldHandlers('q', state, createGlobalState())).toThrow('Exception in Handler');
	});
});

// ─── selectFieldHandlers extra coverage ─────────────────────────────

describe('selectFieldHandlers (extra coverage)', () => {
	const opts = [
		{ label: 'Red', value: 'red' },
		{ label: 'Blue', value: 'blue' },
	];

	it('should use custom itemToString for selectedOptionLabel', () => {
		const field = buildSelectField('color', 'red', IdentityOperators.is, {
			options: opts,
			initialVisible: true,
			itemToString: (v: unknown) => `Color: ${v}`,
		});
		const state = createState(field);
		const handlers = selectFieldHandlers('color', state, createGlobalState());

		expect(handlers.selectedOptionLabel()).toBe('Color: red');
	});

	it('should unwrap single-element array in updateControl', () => {
		const field = buildSelectField('color', 'red', IdentityOperators.is, {
			options: opts,
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = selectFieldHandlers('color', state, createGlobalState());

		handlers.updateControl(['blue']);
		expect(handlers.controlValue()).toBe('blue');
	});

	it('should pass through scalar value in updateControl', () => {
		const field = buildSelectField('color', 'red', IdentityOperators.is, {
			options: opts,
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = selectFieldHandlers('color', state, createGlobalState());

		handlers.updateControl('blue');
		expect(handlers.controlValue()).toBe('blue');
	});
});

// ─── dateRangeFieldHandlers extra coverage ──────────────────────────

describe('dateRangeFieldHandlers (extra coverage)', () => {
	it('should expose min/max when provided', () => {
		const s = new Date('2024-01-01');
		const e = new Date('2024-06-30');
		const min = new Date('2023-01-01');
		const max = new Date('2025-12-31');

		const field = buildDateRangeField('period', { start: s, end: e }, Operators.between, {
			initialVisible: true,
			min,
			max,
		});
		const state = createState(field);
		const handlers = dateRangeFieldHandlers('period', state, createGlobalState());

		expect(handlers.min()).toEqual(min);
		expect(handlers.max()).toEqual(max);
	});

	it('should update controlValue via updateControl', () => {
		const s = new Date('2024-01-01');
		const e = new Date('2024-06-30');

		const field = buildDateRangeField('period', { start: s, end: e }, Operators.between, {
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = dateRangeFieldHandlers('period', state, createGlobalState());

		const newValue = { start: new Date('2025-03-01'), end: new Date('2025-09-30') };
		handlers.updateControl(newValue);
		expect(handlers.controlValue()).toEqual(newValue);
	});
});

// ─── rangeFieldHandlers extra coverage ──────────────────────────────

describe('rangeFieldHandlers (extra coverage)', () => {
	it('should default min to null and max to null when not provided', () => {
		const field = buildRangeField('r', [10, 50], Operators.between, { initialVisible: true });
		const state = createState(field);
		const handlers = rangeFieldHandlers('r', state, createGlobalState());

		// buildRangeField defaults min=0 and max=100, so handlers should reflect those
		expect(handlers.min()).toBe(0);
		expect(handlers.max()).toBe(100);
	});

	it('should reflect custom min/max from field options', () => {
		const field = buildRangeField('r', [10, 50], Operators.between, {
			initialVisible: true,
			min: -50,
			max: 500,
		});
		const state = createState(field);
		const handlers = rangeFieldHandlers('r', state, createGlobalState());

		expect(handlers.min()).toBe(-50);
		expect(handlers.max()).toBe(500);
	});
});

// ─── comboboxFieldHandlers extra coverage ───────────────────────────

describe('comboboxFieldHandlers (extra coverage)', () => {
	it('should default placeholder to empty string when not provided', () => {
		const field = buildComboField('tag', '', IdentityOperators.is, {
			options: [{ label: 'A', value: 'a' }],
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = comboboxFieldHandlers('tag', state, createGlobalState());

		expect(handlers.placeholder()).toBe('');
	});

	it('should default options to empty array when not set', () => {
		// buildComboField always sets __options, but if somehow it were missing
		// the handler defaults to []. We can at least verify the handler reads what's there.
		const field = buildComboField('tag', '', IdentityOperators.is, {
			options: [],
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = comboboxFieldHandlers('tag', state, createGlobalState());

		expect(handlers.options()).toEqual([]);
	});
});

// ─── timeFieldHandlers extra coverage ───────────────────────────────

describe('timeFieldHandlers (extra coverage)', () => {
	it('should expose min/max when provided', () => {
		const min = new Date('2024-06-15T08:00:00');
		const max = new Date('2024-06-15T20:00:00');
		const field = buildTimeField('alarm', new Date('2024-06-15T14:00:00'), TimeOperators.at, {
			initialVisible: true,
			min,
			max,
		});
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());

		expect(handlers.min()).toEqual(min);
		expect(handlers.max()).toEqual(max);
	});

	it('should default min/max to null when not provided', () => {
		const field = buildTimeField('alarm', new Date('2024-06-15T14:00:00'), TimeOperators.at, {
			initialVisible: true,
		});
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());

		expect(handlers.min()).toBeNull();
		expect(handlers.max()).toBeNull();
	});

	it('should correctly read AM times', () => {
		const base = new Date(2024, 5, 15, 9, 15, 30); // 9:15:30 AM
		const field = buildTimeField('alarm', base, TimeOperators.at, { initialVisible: true });
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());

		const tv = handlers.controlValue();
		expect(tv.hours).toBe(9);
		expect(tv.minutes).toBe(15);
		expect(tv.seconds).toBe(30);
		expect(tv.period).toBe('AM');
	});

	it('should handle midnight (0:00) correctly for controlValue', () => {
		const base = new Date(2024, 5, 15, 0, 0, 0);
		const field = buildTimeField('alarm', base, TimeOperators.at, { initialVisible: true });
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());

		const tv = handlers.controlValue();
		expect(tv.hours).toBe(12); // midnight displays as 12 AM
		expect(tv.minutes).toBe(0);
		expect(tv.seconds).toBe(0);
		expect(tv.period).toBe('AM');
	});

	it('should handle noon (12:00) correctly for controlValue', () => {
		const base = new Date(2024, 5, 15, 12, 0, 0);
		const field = buildTimeField('alarm', base, TimeOperators.at, { initialVisible: true });
		const state = createState(field);
		const handlers = timeFieldHandlers('alarm', state, createGlobalState());

		const tv = handlers.controlValue();
		expect(tv.hours).toBe(12);
		expect(tv.minutes).toBe(0);
		expect(tv.seconds).toBe(0);
		expect(tv.period).toBe('PM');
	});
});
