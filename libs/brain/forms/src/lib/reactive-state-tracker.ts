import { computed, signal } from '@angular/core';
import type { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import type { Subscription } from 'rxjs';
import type { ControlState } from './control-state';
import type { ErrorStateMatcher } from './error-options';
import { controlStateEqual, type StateTracker } from './state-tracker';

export class ReactiveStateTracker implements StateTracker {
	private readonly _stateVersion = signal(0);
	private readonly _eventsSubscription?: Subscription;

	public readonly controlState = computed<ControlState | null>(
		() => {
			const control = this._ngControl.control as AbstractControl | null | undefined;
			if (!control) return null;

			this._stateVersion();

			const spartanInvalid = this._matcher?.isInvalid(control, this._controlParent) ?? false;

			return {
				dirty: control.dirty,
				errors: control.errors,
				invalid: control.invalid,
				spartanInvalid,
				touched: control.touched,
			};
		},
		{ equal: controlStateEqual },
	);

	public readonly errors = computed(() => this.controlState()?.errors ?? null);
	public readonly dirty = computed(() => this.controlState()?.dirty ?? null);
	public readonly invalid = computed(() => this.controlState()?.invalid ?? null);
	public readonly spartanInvalid = computed(() => this.controlState()?.spartanInvalid ?? null);
	public readonly touched = computed(() => this.controlState()?.touched ?? null);

	private get _controlParent() {
		return this._parentFormGroup || this._parentForm;
	}

	constructor(
		private readonly _ngControl: NgControl,
		private readonly _matcher: ErrorStateMatcher | null,
		private readonly _parentFormGroup: FormGroupDirective | null,
		private readonly _parentForm: NgForm | null,
	) {
		const control = _ngControl.control;
		if (control) {
			this._eventsSubscription = control.events.subscribe(() => {
				this._stateVersion.update((v) => v + 1);
			});
		}
	}

	public destroy(): void {
		this._eventsSubscription?.unsubscribe();
	}
}
