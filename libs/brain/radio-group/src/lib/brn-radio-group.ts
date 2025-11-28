/* eslint-disable @typescript-eslint/no-empty-function */
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	contentChildren,
	Directive,
	DoCheck,
	effect,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	OnInit,
	output,
	untracked,
} from '@angular/core';
import { FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgForm, type ControlValueAccessor } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker, type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnRadio, BrnRadioChange } from './brn-radio';
import { provideBrnRadioGroupToken } from './brn-radio-group.token';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroup),
	multi: true,
};

@Directive({
	selector: '[brnRadioGroup]',
	providers: [
		BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
		provideBrnRadioGroupToken(BrnRadioGroup),
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnRadioGroup),
		},
	],
	host: {
		role: 'radiogroup',
		'[dir]': 'direction()',
		'(focusout)': 'onTouched()',
		'[attr.aria-invalid]': 'errorState() ? "true" : null',
	},
})
export class BrnRadioGroup<T = unknown> implements ControlValueAccessor, OnInit, DoCheck {
	private static _nextUniqueId = 0;

	protected onChange: ChangeFn<T> = () => {};

	protected onTouched: TouchFn = () => {};

	public readonly name = input<string>(`brn-radio-group-${++BrnRadioGroup._nextUniqueId}`);

	/**
	 * The value of the selected radio button.
	 */
	public readonly value = model<T>();

	/** Emits when the value changes. */
	public readonly valueChange = output<T>();

	/**
	 * Whether the radio group is disabled.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * Whether the radio group should be required.
	 */
	public readonly required = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * The direction of the radio group.
	 */
	public readonly direction = input<'ltr' | 'rtl' | null>('ltr');

	/**
	 * Event emitted when the group value changes.
	 */
	public readonly change = output<BrnRadioChange<T>>();

	/**
	 * The internal disabled state of the radio group.
	 * @internal
	 */
	public readonly disabledState = linkedSignal(() => this.disabled());

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	public ngControl: NgControl | null = null;
	private readonly _injector = inject(Injector);
	private readonly _errorStateTracker = new ErrorStateTracker(
		this._defaultErrorStateMatcher,
		null,
		this._parentFormGroup,
		this._parentForm,
	);

	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	/**
	 * Access the radio buttons within the group.
	 * @internal
	 */
	public readonly radioButtons = contentChildren(BrnRadio, { descendants: true });

	constructor() {
		effect(() => {
			const error = this._errorStateTracker.errorState();
			untracked(() => {
				if (this.ngControl) {
					const shouldShowError = error && this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty);
					this._errorStateTracker.errorState.set(shouldShowError ? true : false);
				}
			});
		});
	}

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
		this._errorStateTracker.ngControl = this.ngControl;
	}

	writeValue(value: T): void {
		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabledState.set(isDisabled);
	}

	ngDoCheck(): void {
		this._errorStateTracker.updateErrorState();
	}

	/**
	 * Select a radio button.
	 * @internal
	 */
	select(radioButton: BrnRadio<T>, value: T): void {
		if (this.value() === value) {
			return;
		}

		this.value.set(value);
		this.valueChange.emit(value);
		this.onChange(value);
		this.change.emit(new BrnRadioChange<T>(radioButton, value));
	}
}
