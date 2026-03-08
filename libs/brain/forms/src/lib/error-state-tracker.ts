import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BehaviorSubject, map, of, startWith, switchMap } from 'rxjs';
import { ControlState } from './control-state';
import type { ErrorStateMatcher } from './error-options';

export class ErrorStateTracker {
	/** User-defined matcher for the error state. */
	public matcher: ErrorStateMatcher | null = null;

	private readonly _ngControl = new BehaviorSubject<NgControl | null>(null);

	public readonly controlState = toSignal<ControlState | null>(
		this._ngControl.pipe(
			switchMap((ngControl) => {
				if (!ngControl) return of(null);

				const control = ngControl.control as AbstractControl;
				return control.events.pipe(
					startWith(() => this._getState(control)),
					map(() => this._getState(control)),
				);
			}),
		),
		{
			requireSync: true,
			equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
		},
	);

	public readonly errors = computed(() => this.controlState()?.errors ?? null);

	public readonly dirty = computed(() => this.controlState()?.dirty ?? null);

	public readonly invalid = computed(() => this.controlState()?.invalid ?? null);

	public readonly spartanInvalid = computed(() => this.controlState()?.spartanInvalid ?? null);

	public readonly touched = computed(() => this.controlState()?.touched ?? null);

	private get _controlParent() {
		return this._parentFormGroup || this._parentForm;
	}

	private get _matcher() {
		return this.matcher || this._defaultMatcher;
	}

	constructor(
		private readonly _defaultMatcher: ErrorStateMatcher | null,
		private readonly _parentFormGroup: FormGroupDirective | null,
		private readonly _parentForm: NgForm | null,
		ngControl: NgControl | null = null,
	) {
		if (ngControl) {
			this.setControl(ngControl);
		}
	}

	public setControl(ngControl: NgControl): void {
		// Wait for next tick so the ngControl.control property gets initialized
		Promise.resolve().then(() => {
			this._ngControl.next(ngControl);
		});
	}

	private _getState(control: AbstractControl): ControlState {
		const spartanInvalid = this._matcher?.isInvalid(control, this._controlParent) ?? false;

		return {
			dirty: control.dirty,
			errors: control.errors,
			invalid: control.invalid,
			spartanInvalid: spartanInvalid,
			touched: control.touched,
		};
	}
}
