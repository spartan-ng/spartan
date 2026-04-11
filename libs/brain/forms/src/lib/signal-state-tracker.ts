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
