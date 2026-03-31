import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import type { ControlState } from './control-state';
import type { ErrorStateMatcher } from './error-options';

export class ErrorStateTracker {
	private readonly _ngControl = new BehaviorSubject<NgControl | null>(null);

	public readonly controlState = toSignal<ControlState | null>(
		this._ngControl.pipe(
			switchMap((ngControl) => {
				if (!ngControl) return of(null);

				const control = ngControl.control as AbstractControl | null | undefined;
				if (!control) {
					throw new Error(
						`ErrorStateTracker: ngControl.control is null or undefined. This usually means the form control directive (e.g. formControlName or ngModel) ` +
							`found an NgControl in the DI tree but no ControlValueAccessor was registered to back it. ` +
							`Ensure the host component or directive provides NG_VALUE_ACCESSOR (e.g. { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => YourComponent), multi: true }) ` +
							`and implements the ControlValueAccessor interface.`,
					);
				}

				return control.events.pipe(
					startWith(() => this._getState(control)),
					map(() => this._getState(control)),
				);
			}),
			catchError((error) => {
				console.error(error);
				return of(null);
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

	constructor(
		private readonly _matcher: ErrorStateMatcher | null,
		private readonly _parentFormGroup: FormGroupDirective | null,
		private readonly _parentForm: NgForm | null,
	) {}

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
