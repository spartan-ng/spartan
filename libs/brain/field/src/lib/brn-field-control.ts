import { Directive, inject, Injector, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';

@Directive()
export class BrnFieldControl implements OnInit {
	private readonly _injector = inject(Injector);
	private readonly _errorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	private readonly _errorStateTracker = new ErrorStateTracker(
		this._errorStateMatcher,
		this._parentFormGroup,
		this._parentForm,
	);

	/** Gets the AbstractControlDirective for this control. */
	public ngControl: NgControl | null = null;

	public readonly controlState = this._errorStateTracker.controlState;
	public readonly errors = this._errorStateTracker.errors;
	public readonly dirty = this._errorStateTracker.dirty;
	public readonly invalid = this._errorStateTracker.invalid;
	public readonly spartanInvalid = this._errorStateTracker.spartanInvalid;
	public readonly touched = this._errorStateTracker.touched;

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);
		if (this.ngControl) {
			this._errorStateTracker.setControl(this.ngControl);
		}
	}
}
