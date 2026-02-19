import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vitest } from 'vitest';
import { FieldLabel } from './field-label';
import { FieldClose } from './field-close';
import { FieldOperator } from './field-operator';

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
		globalThis.ResizeObserver = class ResizeObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		} as any;
	}
}

// ─── FieldLabel ────────────────────────────────────────────────────

describe('FieldLabel', () => {
	@Component({
		selector: 'test-label-host',
		standalone: true,
		imports: [FieldLabel],
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
		template: `<spartan-rich-filter-field-label [label]="label" [for]="forId" />`,
	})
	class TestHost {
		label = 'Name';
		forId = 'field-name';
	}

	beforeEach(async () => {
		setupMatchMedia();
		await TestBed.configureTestingModule({
			imports: [TestHost],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();
		const labelEl = fixture.nativeElement.querySelector('spartan-rich-filter-field-label');
		expect(labelEl).toBeTruthy();
	});

	it('should render a label element', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();
		const label = fixture.nativeElement.querySelector('label');
		expect(label).toBeTruthy();
		expect(label.textContent.trim()).toBe('Name');
	});

	it('should set the for attribute', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();
		const label = fixture.nativeElement.querySelector('label');
		expect(label?.getAttribute('for')).toBe('field-name');
	});

	it('should update label text when input changes', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();

		fixture.componentInstance.label = 'Updated';
		fixture.detectChanges();

		const label = fixture.nativeElement.querySelector('label');
		expect(label.textContent.trim()).toBe('Updated');
	});
});

// ─── FieldClose ────────────────────────────────────────────────────

describe('FieldClose', () => {
	@Component({
		selector: 'test-close-host',
		standalone: true,
		imports: [FieldClose],
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
		template: `<spartan-rich-filter-field-close (onCloseField)="closed = true" />`,
	})
	class TestHost {
		closed = false;
	}

	beforeEach(async () => {
		setupMatchMedia();
		await TestBed.configureTestingModule({
			imports: [TestHost],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();
		const el = fixture.nativeElement.querySelector('spartan-rich-filter-field-close');
		expect(el).toBeTruthy();
	});

	it('should emit onCloseField when button is clicked', () => {
		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();

		const button = fixture.nativeElement.querySelector('button');
		button?.click();
		fixture.detectChanges();

		expect(fixture.componentInstance.closed).toBe(true);
	});
});

// ─── FieldOperator ─────────────────────────────────────────────────

describe('FieldOperator', () => {
	it('should create the component', async () => {
		setupMatchMedia();

		@Component({
			selector: 'test-operator-host',
			standalone: true,
			imports: [FieldOperator],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			template: `<spartan-rich-filter-field-operator [operators]="ops" [operatorValue]="val" (operatorValueChange)="changed = $event" />`,
		})
		class TestHost {
			ops = { equals: 'eq', notEquals: 'neq' };
			val: string | undefined = 'eq';
			changed: unknown = null;
		}

		await TestBed.configureTestingModule({
			imports: [TestHost],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();

		const fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();

		const el = fixture.nativeElement.querySelector('spartan-rich-filter-field-operator');
		expect(el).toBeTruthy();
	});

	it('should transform operators record into _operators array', async () => {
		setupMatchMedia();

		await TestBed.configureTestingModule({
			imports: [FieldOperator],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();

		const fixture = TestBed.createComponent(FieldOperator);
		fixture.componentRef.setInput('operators', { equals: 'eq', greaterThan: 'gt' });
		fixture.componentRef.setInput('operatorValue', 'eq');
		fixture.detectChanges();

		const operators = (fixture.componentInstance as any)._operators();
		expect(operators).toEqual([
			{ key: 'equals', value: 'eq' },
			{ key: 'greaterThan', value: 'gt' },
		]);
	});
});
