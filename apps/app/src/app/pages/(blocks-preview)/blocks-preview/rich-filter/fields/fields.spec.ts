import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { vitest } from 'vitest';
import {
	EqualityOperators,
	IdentityOperators,
	RangeOperators,
	TextOperators,
	TimeOperators,
} from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';

import { BooleanField } from './boolean';
import { ComboField } from './combo';
import { DateField } from './date';
import { DateRangeField } from './daterange';
import { NumberField } from './number';
import { RangeField } from './range';
import { SelectField } from './select';
import { TextField } from './text';
import { TimeField } from './time';

// ─── helpers ────────────────────────────────────────────────────────

/** Build a mock handler that satisfies all possible field handler shapes */
function mockHandler(overrides: Record<string, unknown> = {}) {
	return {
		controlValue: signal<unknown>(null),
		controlLabel: signal('Test Label'),
		formId: signal('test-field-id'),
		operatorValue: signal<unknown>('eq'),
		updateControl: vitest.fn(),
		closeField: vitest.fn(),
		setOperator: vitest.fn(),
		fieldRequired: signal(false),
		min: signal<unknown>(null),
		max: signal<unknown>(null),
		step: signal(1),
		options: signal<unknown[]>([]),
		selectedOptionLabel: signal(''),
		placeholder: signal(''),
		itemToString: signal((v: unknown) => String(v)),
		fieldResourceRequest: signal({ url: '' }),
		fieldResourceOptions: { defaultValue: [] },
		...overrides,
	};
}

function setupMatchMedia() {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vitest.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: vitest.fn(),
			removeEventListener: vitest.fn(),
			dispatchEvent: vitest.fn(),
		})),
	});

	// jsdom does not provide ResizeObserver
	if (typeof globalThis.ResizeObserver === 'undefined') {
		/* eslint-disable @typescript-eslint/no-empty-function */
		globalThis.ResizeObserver = class ResizeObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		} as any;
		/* eslint-enable @typescript-eslint/no-empty-function */
	}
}

// ─── TextField ─────────────────────────────────────────────────────

describe('TextField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({ controlValue: signal('hello') });

		await TestBed.configureTestingModule({
			imports: [TextField, FormsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(TextField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose TextOperators as operator set', () => {
		const fixture = TestBed.createComponent(TextField);
		expect(fixture.componentInstance.operators).toBe(TextOperators);
	});

	it('should inject the handler as service', () => {
		const fixture = TestBed.createComponent(TextField);
		// the protected service should be the mock handler
		expect((fixture.componentInstance as any).service).toBe(handler);
	});
});

// ─── NumberField ───────────────────────────────────────────────────

describe('NumberField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({ controlValue: signal(42) });

		await TestBed.configureTestingModule({
			imports: [NumberField, FormsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(NumberField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose EqualityOperators as operator set', () => {
		const fixture = TestBed.createComponent(NumberField);
		expect(fixture.componentInstance.operators).toBe(EqualityOperators);
	});
});

// ─── BooleanField ──────────────────────────────────────────────────

describe('BooleanField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({ controlValue: signal(true) });

		await TestBed.configureTestingModule({
			imports: [BooleanField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(BooleanField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should inject the handler as service (no operator)', () => {
		const fixture = TestBed.createComponent(BooleanField);
		const service = (fixture.componentInstance as any).service;
		expect(service).toBe(handler);
	});
});

// ─── TimeField ─────────────────────────────────────────────────────

describe('TimeField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({
			controlValue: signal({ hours: 2, minutes: 30, seconds: 0, period: 'PM' }),
		});

		await TestBed.configureTestingModule({
			imports: [TimeField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(TimeField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose TimeOperators as operator set', () => {
		const fixture = TestBed.createComponent(TimeField);
		expect(fixture.componentInstance.operators).toBe(TimeOperators);
	});
});

// ─── RangeField ────────────────────────────────────────────────────

describe('RangeField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({ controlValue: signal([10, 90] as [number, number]) });

		await TestBed.configureTestingModule({
			imports: [RangeField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(RangeField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose RangeOperators as operator set', () => {
		const fixture = TestBed.createComponent(RangeField);
		expect(fixture.componentInstance.operators).toBe(RangeOperators);
	});

	it('should compute _displayRange for positive values', () => {
		const fixture = TestBed.createComponent(RangeField);
		expect((fixture.componentInstance as any)._displayRange()).toBe('10 - 90');
	});

	it('should wrap negative values in parentheses in _displayRange', () => {
		handler.controlValue.set([-5, 20] as [number, number]);
		const fixture = TestBed.createComponent(RangeField);
		expect((fixture.componentInstance as any)._displayRange()).toBe('(-5) - 20');
	});

	it('should wrap both negative values in parentheses', () => {
		handler.controlValue.set([-10, -3] as [number, number]);
		const fixture = TestBed.createComponent(RangeField);
		expect((fixture.componentInstance as any)._displayRange()).toBe('(-10) - (-3)');
	});

	it('should handle zero as non-negative', () => {
		handler.controlValue.set([0, 100] as [number, number]);
		const fixture = TestBed.createComponent(RangeField);
		expect((fixture.componentInstance as any)._displayRange()).toBe('0 - 100');
	});
});

// ─── DateField ─────────────────────────────────────────────────────

describe('DateField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({ controlValue: signal(new Date('2024-06-15')) });

		await TestBed.configureTestingModule({
			imports: [DateField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		})
			// Override template to avoid @let / popover portal issues in jsdom
			.overrideComponent(DateField, {
				set: {
					template: '<div>date-stub</div>',
					imports: [],
				},
			})
			.compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(DateField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose TimeOperators as operator set', () => {
		const fixture = TestBed.createComponent(DateField);
		expect(fixture.componentInstance.operators).toBe(TimeOperators);
	});

	it('should call updateControl when updateControlValue receives a Date', () => {
		const fixture = TestBed.createComponent(DateField);
		const newDate = new Date('2025-01-01');
		fixture.componentInstance.updateControlValue(newDate);
		expect(handler.updateControl).toHaveBeenCalledWith(newDate);
	});

	it('should not call updateControl when value is null', () => {
		const fixture = TestBed.createComponent(DateField);
		fixture.componentInstance.updateControlValue(null);
		expect(handler.updateControl).not.toHaveBeenCalled();
	});
});

// ─── DateRangeField ────────────────────────────────────────────────

describe('DateRangeField', () => {
	let handler: ReturnType<typeof mockHandler>;
	const start = new Date('2024-01-01');
	const end = new Date('2024-06-30');

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({
			controlValue: signal([start, end] as [Date, Date]),
		});

		await TestBed.configureTestingModule({
			imports: [DateRangeField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose RangeOperators as operator set', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		expect((fixture.componentInstance as any).operators).toBe(RangeOperators);
	});

	it('should compute startDate from controlValue[0]', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		expect(fixture.componentInstance.startDate()).toEqual(start);
	});

	it('should compute endDate from controlValue[1]', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		expect(fixture.componentInstance.endDate()).toEqual(end);
	});

	it('should not call updateControl until both start and end are provided', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		const inst = fixture.componentInstance as any;

		// Only set start — should not update yet
		inst.updateStartDate(new Date('2025-03-01'));
		expect(handler.updateControl).not.toHaveBeenCalled();
	});

	it('should call updateControl with tuple when both start and end are set', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		const inst = fixture.componentInstance as any;
		const newStart = new Date('2025-03-01');
		const newEnd = new Date('2025-09-15');

		inst.updateStartDate(newStart);
		inst.updateEndDate(newEnd);

		expect(handler.updateControl).toHaveBeenCalledWith([newStart, newEnd]);
	});

	it('should not call updateControl if end is set without a prior start', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		const inst = fixture.componentInstance as any;

		inst.updateEndDate(new Date('2025-09-15'));
		expect(handler.updateControl).not.toHaveBeenCalled();
	});

	it('should reset tempStart after complete range selection', () => {
		const fixture = TestBed.createComponent(DateRangeField);
		const inst = fixture.componentInstance as any;

		inst.updateStartDate(new Date('2025-03-01'));
		inst.updateEndDate(new Date('2025-09-15'));

		// After completing a selection, tempStart should be reset
		// attempting another endDate without a new startDate should be a no-op
		handler.updateControl.mockClear();
		inst.updateEndDate(new Date('2025-12-01'));
		expect(handler.updateControl).not.toHaveBeenCalled();
	});
});

// ─── SelectField ───────────────────────────────────────────────────

describe('SelectField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({
			controlValue: signal('red'),
			options: signal([
				{ label: 'Red', value: 'red' },
				{ label: 'Blue', value: 'blue' },
			]),
			selectedOptionLabel: signal('Red'),
		});

		await TestBed.configureTestingModule({
			imports: [SelectField],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(SelectField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose IdentityOperators as operator set', () => {
		const fixture = TestBed.createComponent(SelectField);
		expect(fixture.componentInstance.operators).toBe(IdentityOperators);
	});
});

// ─── ComboField ────────────────────────────────────────────────────

describe('ComboField', () => {
	let handler: ReturnType<typeof mockHandler>;

	beforeEach(async () => {
		setupMatchMedia();
		handler = mockHandler({
			controlValue: signal(''),
			options: signal([{ label: 'Tag A', value: 'a' }]),
			placeholder: signal('Pick...'),
		});

		await TestBed.configureTestingModule({
			imports: [ComboField, FormsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: FILTER_HANDLER, useValue: handler }],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(ComboField);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should expose IdentityOperators as operator set', () => {
		const fixture = TestBed.createComponent(ComboField);
		expect(fixture.componentInstance.operators).toBe(IdentityOperators);
	});
});
