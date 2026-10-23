import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	computed,
	Directive,
	forwardRef,
	inject,
	input,
	linkedSignal,
	numberAttribute,
	output,
	signal,
	untracked,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnInputOtpInput } from './brn-input-otp-input';
import { provideBrnInputOtp } from './brn-input-otp.token';

export type { InputMode } from './brn-input-otp-input';

export const BRN_INPUT_OTP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnInputOtp),
	multi: true,
};

@Directive({
	selector: 'brn-input-otp, [brnInputOtp]',
	exportAs: 'brnInputOtp',
	providers: [BRN_INPUT_OTP_VALUE_ACCESSOR, provideBrnInputOtp(BrnInputOtp), provideBrnLabelable(BrnInputOtp)],
	hostDirectives: [BrnFieldControl],
	host: {
		'[style]': 'hostStyles()',
		'data-input-otp-container': 'true',
	},
})
export class BrnInputOtp implements ControlValueAccessor {
	private static _id = 0;

	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

	public readonly invalid = this._fieldControl?.invalid;
	public readonly touched = this._fieldControl?.touched;
	public readonly dirty = this._fieldControl?.dirty;
	public readonly spartanInvalid = this._fieldControl?.spartanInvalid;

	/** Whether the input has focus. */
	protected readonly _focused = signal<boolean>(false);

	/** Styles applied to the host element. */
	public readonly hostStyles = input<string>(
		'position: relative; cursor: text; user-select: none; pointer-events: none;',
	);

	/** Custom id applied to the input element */
	public readonly inputId = input<string>(`brn-input-otp-${++BrnInputOtp._id}`);

	public readonly labelableId = this.inputId;

	/** Determine if the input is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** The number of slots. */
	public readonly length = input.required<number, NumberInput>({ transform: numberAttribute });

	/**
	 * Optional per-character pattern. Each typed or pasted character must match this
	 * pattern. Strings are treated as a single-character regular expression.
	 *
	 * Examples: '[0-9]', '[A-Za-z0-9]'
	 */
	public readonly slotPattern = input<string | RegExp | null>(null);

	/** Whether entered characters should be visually masked. */
	public readonly mask = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** The character used to mask entered characters. */
	public readonly maskChar = input<string>('•');

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
	public readonly value = linkedSignal(() => {
		const valueInput = this.valueInput();

		// Keep configuration changes from resetting the current value.
		return untracked(() => this.sanitizeValue(valueInput));
	});

	/** Emits when the value changes. */
	public readonly valueChange = output<string>();

	public readonly context = computed(() => {
		const value = this.value() ?? '';
		const focused = this._focused();
		const length = this.length();
		const mask = this.mask();
		const maskChar = this.maskChar();
		const slots = Array.from({ length: this.length() }).map((_, slotIndex) => {
			const char = value[slotIndex] !== undefined ? value[slotIndex] : null;

			const isActive = focused && (value.length === slotIndex || (value.length === length && slotIndex === length - 1));

			return {
				char,
				displayChar: char !== null && mask ? maskChar : char,
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

	/** The registered hidden input element. */
	private readonly _input = signal<BrnInputOtpInput | null>(null);

	constructor() {
		afterNextRender(() => {
			if (this.autofocus()) {
				this.focus();
			}
		});
	}

	/** @internal */
	public sanitizeValue(value: string | null | undefined, clamp = true): string {
		const length = this.length();
		const text = value ?? '';
		const pattern = this.slotPattern();
		const regex = pattern ? toCharRegex(pattern) : null;
		const filtered = regex
			? Array.from(text)
					.filter((char) => regex.test(char))
					.join('')
			: text;

		return clamp ? filtered.slice(0, length) : filtered;
	}

	/** Focus the underlying input element. */
	public focus(): void {
		this._input()?.focus();
	}

	/** @internal */
	public registerInput(input: BrnInputOtpInput): void {
		this._input.set(input);
	}

	/** @internal */
	public unregisterInput(input: BrnInputOtpInput): void {
		if (this._input() === input) {
			this._input.set(null);
		}
	}

	/** @internal */
	public onFocus(): void {
		this._focused.set(true);
	}

	/** @internal */
	public onBlur(): void {
		this._focused.set(false);
		this._onTouched?.();
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: string | null): void {
		const sanitizedValue = this.sanitizeValue(value);

		this.value.set(sanitizedValue);

		if (sanitizedValue.length === this.length()) {
			this.completed.emit(sanitizedValue);
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

	/** @internal */
	public updateValue(newValue: string): void {
		const previousValue = this.value() ?? '';
		const length = this.length();
		const sanitizedValue = this.sanitizeValue(newValue);

		this.value.set(sanitizedValue);
		this.valueChange.emit(sanitizedValue);
		this._onChange?.(sanitizedValue);

		if (this.isCompleted(sanitizedValue, previousValue, length)) {
			this.completed.emit(sanitizedValue);
		}
	}
}

function toCharRegex(pattern: string | RegExp): RegExp {
	if (pattern instanceof RegExp) {
		// Strip stateful flags so repeated .test() calls remain deterministic.
		return new RegExp(`^(?:${pattern.source})$`, pattern.flags.replace(/[gy]/g, ''));
	}

	return new RegExp(`^(?:${pattern})$`);
}
