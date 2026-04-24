import { computed } from '@angular/core';
import type { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import type { ControlState } from './control-state';
import type { ErrorStateMatcher } from './error-options';
import { controlStateEqual, type StateTracker } from './state-tracker';

export class SignalStateTracker implements StateTracker {
	private readonly _control = computed(() => {
		const control = this._ngControl.control as AbstractControl | null | undefined;
		if (!control) return null;
		return control;
	});
	// With signal forms, AbstractControl is implemented by InteropNgControl, whose control state
	// properties (e.g. dirty, touched, invalid) are getter functions that internally read FormField state signals.
	// Accessing them inside a computed() therefore creates reactive signal dependencies automatically.
	// See: https://github.com/angular/angular/blob/39e382a756b552d2b7bd3ce2c364daee9d7a0056/packages/forms/signals/src/controls/interop_ng_control.ts#L68-L129
	public readonly dirty = computed<boolean | null>(() => this._control()?.dirty ?? null);
	public readonly touched = computed<boolean | null>(() => this._control()?.touched ?? null);
	public readonly invalid = computed<boolean | null>(() => this._control()?.invalid ?? null);
	public readonly errors = computed(() => this._control()?.errors ?? null);
	public readonly spartanInvalid = computed<boolean | null>(() => {
		const control = this._control();
		if (!control) {
			return null;
		}
		return this._matcher?.isInvalid(control, this._controlParent) ?? false;
	});

	public readonly controlState = computed<ControlState | null>(
		() => {
			const dirty = this.dirty();
			const invalid = this.invalid();
			const touched = this.touched();
			const spartanInvalid = this.spartanInvalid();
			const errors = this.errors();
			if (dirty === null || invalid === null || touched === null || spartanInvalid === null) return null;
			return { dirty, errors, invalid, spartanInvalid, touched };
		},
		{ equal: controlStateEqual },
	);

	private get _controlParent() {
		return this._parentFormGroup || this._parentForm;
	}

	constructor(
		private readonly _ngControl: NgControl,
		private readonly _matcher: ErrorStateMatcher | null,
		private readonly _parentFormGroup: FormGroupDirective | null,
		private readonly _parentForm: NgForm | null,
	) {}

	public destroy(): void {
		// No subscriptions to clean up for signal-based controls
	}
}
