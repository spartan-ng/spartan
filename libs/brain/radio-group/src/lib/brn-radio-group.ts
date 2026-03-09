/* eslint-disable @typescript-eslint/no-empty-function */
import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	contentChildren,
	Directive,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	output,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
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
			provide: BrnFieldControl,
			useExisting: forwardRef(() => BrnRadioGroup),
		},
	],
	host: {
		role: 'radiogroup',
		'[dir]': 'direction()',
		'(focusout)': 'onTouched()',
		'[attr.aria-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
	},
	hostDirectives: [BrnFieldControl],
})
export class BrnRadioGroup<T = unknown> implements ControlValueAccessor {
	private readonly _dir = inject(Directionality);
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });
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
	public readonly direction = this._dir.valueSignal;

	/**
	 * Event emitted when the group value changes.
	 */
	public readonly change = output<BrnRadioChange<T>>();

	/**
	 * The internal disabled state of the radio group.
	 * @internal
	 */
	public readonly disabledState = linkedSignal(() => this.disabled());

	public readonly controlState = this._fieldControl?.controlState;
	protected readonly _ariaInvalid = computed(() => this._fieldControl?.invalid());
	protected readonly _spartanInvalid = computed(() => this._fieldControl?.spartanInvalid());
	protected readonly _dirty = computed(() => this._fieldControl?.dirty());
	protected readonly _touched = computed(() => this._fieldControl?.touched());

	/**
	 * Access the radio buttons within the group.
	 * @internal
	 */
	public readonly radioButtons = contentChildren(BrnRadio, { descendants: true });

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
