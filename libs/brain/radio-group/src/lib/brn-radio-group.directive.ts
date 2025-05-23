/* eslint-disable @typescript-eslint/no-empty-function */
import { BooleanInput } from '@angular/cdk/coercion';
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { provideBrnRadioGroupToken } from './brn-radio-group.token';
import { BrnRadioChange, BrnRadioComponent } from './brn-radio.component';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroupDirective),
	multi: true,
};

@Directive({
	selector: '[brnRadioGroup]',
	providers: [BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, provideBrnRadioGroupToken(BrnRadioGroupDirective)],
	host: {
		role: 'radiogroup',
		'[dir]': 'direction()',
		'(focusout)': 'onTouched()',
	},
})
export class BrnRadioGroupDirective<T = unknown> implements ControlValueAccessor {
	private static _nextUniqueId = 0;

	protected onChange: ChangeFn<T> = () => {};

	protected onTouched: TouchFn = () => {};

	public readonly name = input(`brn-radio-group-${BrnRadioGroupDirective._nextUniqueId++}`);

	/**
	 * The value of the selected radio button.
	 */
	public readonly value = model<T>();

	/**
	 * Whether the radio group is disabled.
	 */
	public disabled = input<boolean, BooleanInput>(false, {
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
	 * The internal disabled state of the radio group. This could be switched to a linkedSignal when we can drop v18 support.
	 * @internal
	 */
	public readonly disabledState = linkedSignal(() => this.disabled());

	/**
	 * Access the radio buttons within the group.
	 * @internal
	 */
	public readonly radioButtons = contentChildren(BrnRadioComponent, { descendants: true });

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
	select(radioButton: BrnRadioComponent<T>, value: T): void {
		if (this.value() === value) {
			return;
		}

		this.value.set(value);
		this.onChange(value);
		this.change.emit(new BrnRadioChange<T>(radioButton, value));
	}
}
