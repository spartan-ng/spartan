import type { AbstractControl, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from './error-options';
import { SignalStateTracker } from './signal-state-tracker';

function createMockControl(overrides: Partial<AbstractControl> = {}): Partial<AbstractControl> {
	return {
		dirty: false,
		touched: false,
		invalid: false,
		errors: null,
		...overrides,
	};
}

function createMockNgControl(control: Partial<AbstractControl> | null = null): NgControl {
	return { control } as unknown as NgControl;
}

describe('SignalStateTracker', () => {
	let matcher: ErrorStateMatcher;

	beforeEach(() => {
		matcher = new ErrorStateMatcher();
	});

	it('should return defaults when control is not available', () => {
		const ngControl = createMockNgControl(null);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);

		expect(tracker.dirty()).toBeNull();
		expect(tracker.touched()).toBeNull();
		expect(tracker.invalid()).toBeNull();
		expect(tracker.errors()).toBeNull();
		expect(tracker.spartanInvalid()).toBeNull();
	});

	it('should read dirty/touched/invalid/errors from the control', () => {
		const control = createMockControl({ dirty: true, touched: true, invalid: true, errors: { required: true } });
		const ngControl = createMockNgControl(control);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);

		expect(tracker.dirty()).toBe(true);
		expect(tracker.touched()).toBe(true);
		expect(tracker.invalid()).toBe(true);
		expect(tracker.errors()).toEqual({ required: true });
	});

	it('should compute spartanInvalid using the error state matcher', () => {
		const control = createMockControl({ invalid: true, touched: true });
		const ngControl = createMockNgControl(control);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);

		expect(tracker.spartanInvalid()).toBe(true);
	});

	it('should not mark spartanInvalid when control is invalid but untouched', () => {
		const control = createMockControl({ invalid: true, touched: false });
		const ngControl = createMockNgControl(control);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);

		expect(tracker.spartanInvalid()).toBe(false);
	});

	it('should compute full controlState when control is present', () => {
		const control = createMockControl({ dirty: true, touched: true, invalid: false, errors: null });
		const ngControl = createMockNgControl(control);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);

		const state = tracker.controlState();
		expect(state).toEqual({
			dirty: true,
			errors: null,
			invalid: false,
			spartanInvalid: false,
			touched: true,
		});
	});

	it('should be safe to call destroy (no-op)', () => {
		const ngControl = createMockNgControl(null);
		const tracker = new SignalStateTracker(ngControl, matcher, null, null);
		expect(() => tracker.destroy()).not.toThrow();
	});
});
