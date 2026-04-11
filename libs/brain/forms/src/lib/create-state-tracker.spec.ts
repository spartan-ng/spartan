import { type Signal, signal } from '@angular/core';
import type { AbstractControl, ControlEvent, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { createStateTracker } from './create-state-tracker';
import { ErrorStateMatcher } from './error-options';
import { ReactiveStateTracker } from './reactive-state-tracker';
import { SignalStateTracker } from './signal-state-tracker';

function mockNgControl(control: Partial<AbstractControl> | null = null): NgControl {
	return { control } as unknown as NgControl;
}

function mockReactiveControl<TValue = unknown>(): Partial<AbstractControl<TValue>> {
	return {
		dirty: false,
		touched: false,
		invalid: false,
		errors: null,
		events: new Subject<ControlEvent<TValue>>(),
	};
}

function mockSignalControl(): Partial<AbstractControl> & { field: Signal<string> } {
	return {
		dirty: false,
		touched: false,
		invalid: false,
		errors: null,
		field: signal('value'),
	};
}

describe('createStateTracker', () => {
	const matcher = new ErrorStateMatcher();

	it('should return ReactiveStateTracker for a standard reactive control', () => {
		const ngControl = mockNgControl(mockReactiveControl());
		const tracker = createStateTracker(ngControl, matcher, null, null);
		expect(tracker).toBeInstanceOf(ReactiveStateTracker);
	});

	it('should return SignalStateTracker when control has a signal field property', () => {
		const ngControl = mockNgControl(mockSignalControl());
		const tracker = createStateTracker(ngControl, matcher, null, null);
		expect(tracker).toBeInstanceOf(SignalStateTracker);
	});

	it('should return ReactiveStateTracker when ngControl.control is null', () => {
		const ngControl = mockNgControl(null);
		const tracker = createStateTracker(ngControl, matcher, null, null);
		expect(tracker).toBeInstanceOf(ReactiveStateTracker);
	});

	it('should return ReactiveStateTracker when control.field is not a signal', () => {
		const control = { ...mockReactiveControl(), field: 'not-a-signal' } as Partial<AbstractControl> & {
			field: string;
		};
		const ngControl = mockNgControl(control);
		const tracker = createStateTracker(ngControl, matcher, null, null);
		expect(tracker).toBeInstanceOf(ReactiveStateTracker);
	});

	it('should forward parentFormGroup and parentForm to the tracker', () => {
		const ngControl = mockNgControl(mockReactiveControl());
		const parentFormGroup = {} as FormGroupDirective;
		const parentForm = {} as NgForm;
		const tracker = createStateTracker(ngControl, matcher, parentFormGroup, parentForm);
		expect(tracker).toBeDefined();
	});
});
