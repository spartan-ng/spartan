import {
	ChangeDetectorRef,
	computed,
	DestroyRef,
	Directive,
	type DoCheck,
	forwardRef,
	inject,
	input,
	type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';

@Directive({
	selector: '[brnDatePicker]',
	standalone: true,
	host: {
		'[attr.aria-describedby]': 'ariaDescribedBy || null',
	},
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnDatePicker),
		},
	],
})
export class BrnDatePicker implements BrnFormFieldControl, DoCheck, OnInit {
	private readonly _cdRef = inject(ChangeDetectorRef);
	private readonly _destroyRef = inject(DestroyRef);

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

	ngOnInit() {
		// Subscribe to form control status changes
		if (this.ngControl) {
			this.ngControl.statusChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
				const oldState = this._errorStateTracker.errorState();
				this._errorStateTracker.updateErrorState();
				const newState = this._errorStateTracker.errorState();
				if (oldState !== newState) {
					this._cdRef.markForCheck();
				}
			});
		}
	}

	ngDoCheck() {
		const oldState = this._errorStateTracker.errorState();
		this._errorStateTracker.updateErrorState();
		const newState = this._errorStateTracker.errorState();
		
		// Mark for check if error state changed to ensure OnPush components update
		if (oldState !== newState) {
			this._cdRef.markForCheck();
		}
	}
}

