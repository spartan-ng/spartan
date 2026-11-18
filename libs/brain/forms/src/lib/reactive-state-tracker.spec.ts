import {
	type AbstractControl,
	type ControlEvent,
	type FormGroupDirective,
	FormResetEvent,
	FormSubmittedEvent,
	type NgControl,
	type NgForm,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorStateMatcher } from './error-options';
import { ReactiveStateTracker } from './reactive-state-tracker';

type MockControl = Partial<AbstractControl> & { events: Subject<ControlEvent<unknown>>; dirty: boolean };

function createMockControl(overrides: Partial<AbstractControl> = {}): MockControl {
	const events = new Subject<ControlEvent<unknown>>();
	return {
		dirty: false,
		touched: false,
		invalid: false,
		errors: null,
		events,
		...overrides,
	} as MockControl;
}

function createMockNgControl(control: MockControl | null = null): NgControl {
	return { control } as unknown as NgControl;
}

class SubmittedMatcher extends ErrorStateMatcher {
	override isInvalid(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control?.invalid && (control.touched || form?.submitted));
	}
}

function createMockForm() {
	return { submitted: false, form: { events: new Subject<ControlEvent>() } };
}

describe('ReactiveStateTracker', () => {
	let matcher: ErrorStateMatcher;

	beforeEach(() => {
		matcher = new ErrorStateMatcher();
	});

	it('should return null controlState when control is not available', () => {
		const ngControl = createMockNgControl(null);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);
		expect(tracker.controlState()).toBeNull();
	});

	it('should compute controlState from a valid control', () => {
		const control = createMockControl({ dirty: true, touched: true, invalid: true, errors: { required: true } });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		const state = tracker.controlState();
		expect(state).toEqual({
			dirty: true,
			errors: { required: true },
			invalid: true,
			spartanInvalid: true,
			touched: true,
		});
	});

	it('should expose derived signals from controlState', () => {
		const control = createMockControl({ dirty: true, touched: false, invalid: true, errors: { min: true } });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		expect(tracker.dirty()).toBe(true);
		expect(tracker.touched()).toBe(false);
		expect(tracker.invalid()).toBe(true);
		expect(tracker.errors()).toEqual({ min: true });
	});

	it('should update controlState when events fire', async () => {
		const control = createMockControl({ dirty: false, touched: false, invalid: false });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		expect(tracker.dirty()).toBe(false);

		// Wait for the Promise.resolve().then() in the constructor to set up the subscription
		await Promise.resolve();
		await Promise.resolve();

		control.dirty = true;
		control.events.next({} as ControlEvent<unknown>);

		expect(tracker.dirty()).toBe(true);
	});

	it('should unsubscribe from events on destroy', async () => {
		const control = createMockControl({ dirty: false });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		// Wait for subscription to be set up
		await Promise.resolve();

		// Verify subscription is working - dirty changes from false to true
		control.dirty = true;
		control.events.next({} as ControlEvent<unknown>);
		expect(tracker.dirty()).toBe(true);

		// Now destroy the tracker
		tracker.destroy();

		// Change dirty back to false and emit event
		control.dirty = false;
		control.events.next({} as ControlEvent<unknown>);

		// After destroy, the subscription is gone so _stateVersion won't increment.
		// The computed is memoized and won't re-read control.dirty until _stateVersion changes.
		// So it should still return the cached value (true) even though control.dirty is now false.
		expect(tracker.dirty()).toBe(true);
	});

	it('should compute spartanInvalid using the error state matcher', () => {
		const control = createMockControl({ invalid: true, touched: true });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		expect(tracker.spartanInvalid()).toBe(true);
	});

	it('should not mark spartanInvalid when control is invalid but not touched', () => {
		const control = createMockControl({ invalid: true, touched: false });
		const ngControl = createMockNgControl(control);
		const tracker = new ReactiveStateTracker(ngControl, matcher, null, null);

		expect(tracker.spartanInvalid()).toBe(false);
	});

	it('should re-run the matcher when the parent form is submitted or reset', () => {
		const form = createMockForm();
		const control = createMockControl({ invalid: true, touched: false });
		const tracker = new ReactiveStateTracker(
			createMockNgControl(control),
			new SubmittedMatcher(),
			null,
			form as unknown as NgForm,
		);
		expect(tracker.spartanInvalid()).toBe(false);

		form.submitted = true;
		form.form.events.next(new FormSubmittedEvent(form as unknown as NgForm));

		expect(tracker.spartanInvalid()).toBe(true);

		// resetForm() emits the reset event first and clears `submitted` afterwards
		form.form.events.next(new FormResetEvent(form as unknown as NgForm));
		form.submitted = false;

		expect(tracker.spartanInvalid()).toBe(false);
	});

	it('should stop listening to form submits on destroy', () => {
		const form = createMockForm();
		new ReactiveStateTracker(
			createMockNgControl(createMockControl()),
			matcher,
			null,
			form as unknown as NgForm,
		).destroy();

		expect(form.form.events.observed).toBe(false);
	});
});
