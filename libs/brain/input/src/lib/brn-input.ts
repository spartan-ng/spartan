import { ChangeDetectorRef, computed, Directive, forwardRef, inject, input, type DoCheck } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';

@Directive({
	selector: '[brnInput]',
	standalone: true,
	host: {
		'[attr.aria-describedby]': 'ariaDescribedBy || null',
	},
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnInput),
		},
	],
})
export class BrnInput implements BrnFormFieldControl, DoCheck {
	private readonly _cdRef = inject(ChangeDetectorRef);

	private readonly _errorStateTracker: ErrorStateTracker;
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public readonly ngControl = inject(NgControl, { optional: true });

	public readonly id = input<string>('');
	public readonly required = computed(() => this.ngControl?.hasError('required') ?? false);
	public readonly disabled = computed(() => this.ngControl?.disabled ?? false);
	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	public ariaDescribedBy = '';

	public setAriaDescribedBy(ids: string) {
		this.ariaDescribedBy = ids;
		this._cdRef.markForCheck();
	}

	constructor() {
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);
	}

	ngDoCheck() {
		this._errorStateTracker.updateErrorState();
	}
}
