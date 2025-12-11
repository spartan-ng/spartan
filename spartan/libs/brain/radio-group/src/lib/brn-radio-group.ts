/* eslint-disable @typescript-eslint/no-empty-function */
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	contentChildren,
	Directive,
	forwardRef,
	input,
	linkedSignal,
	model,
	output,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnRadio, BrnRadioChange } from './brn-radio';
import { provideBrnRadioGroupToken } from './brn-radio-group.token';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroup),
	multi: true,
};

@Directive({
	selector: '[brnRadioGroup]',
	providers: [BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, provideBrnRadioGroupToken(BrnRadioGroup)],
	host: {
		role: 'radiogroup',
		'[dir]': 'direction()',
		'(focusout)': 'onTouched()',
	},
})
export class BrnRadioGroup<T = unknown> implements ControlValueAccessor {
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
