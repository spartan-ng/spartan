import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	forwardRef,
	input,
	linkedSignal,
	numberAttribute,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { ClassValue } from 'clsx';
import { provideBrnInputOtp } from './brn-input-otp.token';

export const BRN_INPUT_OTP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnInputOtp),
	multi: true,
};

export type InputMode = 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

@Component({
	selector: 'brn-input-otp',
	providers: [BRN_INPUT_OTP_VALUE_ACCESSOR, provideBrnInputOtp(BrnInputOtp)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style]': 'hostStyles()',
		'data-input-otp-container': 'true',
	},
	template: `
		<ng-content />
		<div [style]="containerStyles()">
			<input
				#otpInput
				data-slot="input-otp"
				[id]="inputId()"
				[class]="inputClass()"
				[autocomplete]="inputAutocomplete()"
				[style]="inputStyles()"
				[disabled]="_disabled()"
				[inputMode]="inputMode()"
				[value]="value() ?? ''"
				(input)="onInputChange($event)"
				(paste)="onPaste($event)"
				(focus)="_focused.set(true)"
				(blur)="_focused.set(false)"
			/>
		</div>
	`,
})
export class BrnInputOtp implements ControlValueAccessor {
	private static _id = 0;

	/** Whether the input has focus. */
	protected readonly _focused = signal<boolean>(false);

	/** Styles applied to the host element. */
	public readonly hostStyles = input<string>(
		'position: relative; cursor: text; user-select: none; pointer-events: none;',
	);

	/** Custom id applied to the input element */
	public readonly inputId = input<string>(`brn-input-otp-${++BrnInputOtp._id}`);

	/** Custom autocomplete attribute applied to the input element */
	public readonly inputAutocomplete = input<'one-time-code' | 'off'>('one-time-code');

	/** Styles applied to the input element to make it invisible and clickable. */
	public readonly inputStyles = input<string>(
		'position: absolute; inset: 0; width: 100%; height: 100%; display: flex; textAlign: left; opacity: 1; color: transparent; pointerEvents: all; background: transparent; caret-color: transparent; border: 0px solid transparent; outline: transparent solid 0px; box-shadow: none; line-height: 1; letter-spacing: -0.5em; font-family: monospace; font-variant-numeric: tabular-nums;',
	);

	/** Styles applied to the container element. */
	public readonly containerStyles = input<string>('position: absolute; inset: 0; pointer-events: none;');

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly _disabled = linkedSignal(this.disabled);

	/** The number of slots. */
	public readonly length = input.required<number, NumberInput>({ transform: numberAttribute });

	/** Virtual keyboard appearance on mobile */
	public readonly inputMode = input<InputMode>('numeric');

	public readonly inputClass = input<ClassValue>('');

	/** If true, the element is focused automatically on init **/
	public readonly autofocus = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Defines how the pasted text should be transformed before saving to model/form.
	 * Allows pasting text which contains extra characters like spaces, dashes, etc. and are longer than the length.
	 *
	 * "XXX-XXX": (pastedText) => pastedText.replaceAll('-', '')
	 * "XXX XXX": (pastedText) => pastedText.replaceAll(/\s+/g, '')
	 */
	public readonly transformPaste = input<(pastedText: string, length: number) => string>((text) => text);

	/** The value controlling the input */
	public readonly valueInput = input<string | null>(null, { alias: 'value' });
	public readonly value = linkedSignal(this.valueInput);

	/** Emits when the value changes. */
	public readonly valueChange = output<string>();

	public readonly context = computed(() => {
		const value = this.value() ?? '';
		const focused = this._focused();
		const length = this.length();
		const slots = Array.from({ length: this.length() }).map((_, slotIndex) => {
			const char = value[slotIndex] !== undefined ? value[slotIndex] : null;

			const isActive = focused && (value.length === slotIndex || (value.length === length && slotIndex === length - 1));

			return {
				char,
				isActive,
				hasFakeCaret: isActive && value.length === slotIndex,
			};
		});

		return slots;
	});

	/** Emitted when the input is complete, triggered through input or paste.  */
	public readonly completed = output<string>();

	protected _onChange?: ChangeFn<string>;
	protected _onTouched?: TouchFn;

	protected readonly _inputComponentRef = viewChild.required<ElementRef>('otpInput');

	constructor() {
		afterNextRender(() => {
			if (this.autofocus()) {
				this._inputComponentRef().nativeElement.focus();
			}
		});
	}

	protected onInputChange(event: Event) {
		let newValue = (event.target as HTMLInputElement).value;
		const length = this.length();

		if (newValue.length > length) {
			// Replace the last character when length is exceeded
			newValue = newValue.slice(0, length - 1) + newValue.slice(-1);
		}

		this.updateValue(newValue, length);
	}

	protected onPaste(event: ClipboardEvent) {
		event.preventDefault();
		const clipboardData = event.clipboardData?.getData('text/plain') || '';

		const length = this.length();

		const content = this.transformPaste()(clipboardData, length);
		const newValue = content.slice(0, length);

		this.updateValue(newValue, length);
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: string | null): void {
		this.value.set(value);
		if (value?.length === this.length()) {
			this.completed.emit(value ?? '');
		}
	}

	registerOnChange(fn: ChangeFn<string>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}

	private isCompleted(newValue: string, previousValue: string, length: number) {
		return newValue !== previousValue && previousValue.length < length && newValue.length === length;
	}

	private updateValue(newValue: string, length: number) {
		const previousValue = this.value() ?? '';

		this.value.set(newValue);
		this.valueChange.emit(newValue);
		this._onChange?.(newValue);

		if (this.isCompleted(newValue, previousValue, length)) {
			this.completed.emit(newValue);
		}
	}
}
