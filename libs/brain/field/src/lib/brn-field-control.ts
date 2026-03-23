import { DestroyRef, Directive, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import { BrnField } from './brn-field';
import { BrnLabelable } from './brn-labelable';

@Directive()
export class BrnFieldControl implements OnInit {
	private readonly _injector = inject(Injector);
	private readonly _errorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	private readonly _field = inject(BrnField, { optional: true });
	private readonly _destroyRef = inject(DestroyRef);

	private _idEffectRef?: ReturnType<typeof effect>;

	private readonly _errorStateTracker = new ErrorStateTracker(
		this._errorStateMatcher,
		this._parentFormGroup,
		this._parentForm,
	);

	/** Gets the AbstractControlDirective for this control. */
	public ngControl: NgControl | null = null;

	public readonly id = signal<string | null | undefined>(undefined);

	public readonly controlState = this._errorStateTracker.controlState;
	public readonly errors = this._errorStateTracker.errors;
	public readonly dirty = this._errorStateTracker.dirty;
	public readonly invalid = this._errorStateTracker.invalid;
	public readonly spartanInvalid = this._errorStateTracker.spartanInvalid;
	public readonly touched = this._errorStateTracker.touched;

	constructor() {
		this._field?.registerFieldControl(this);
		this._destroyRef.onDestroy(() => {
			this._idEffectRef?.destroy();
		});
	}

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);
		if (this.ngControl) {
			this._errorStateTracker.setControl(this.ngControl);
		}

		const identifiable = this._injector.get(BrnLabelable, null);
		if (identifiable) {
			this._idEffectRef = effect(
				() => {
					this.id.set(identifiable.labelableId());
				},
				{ injector: this._injector },
			);
		}
	}
}
