import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	Component,
	computed,
	forwardRef,
	input,
	model,
	numberAttribute,
	signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { provideBrnInputOtp } from './brn-input-otp.token';

export const BRN_INPUT_OTP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnInputOtpComponent),
	multi: true,
};

export type InputMode = 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

@Component({
	selector: 'brn-input-otp',
	standalone: true,
	imports: [FormsModule],
	template: `
		<ng-content />
		<div style="position: absolute; inset: 0; pointer-events: none;">
			<input
				[class]="inputClass()"
				autocomplete="one-time-code"
				data-slot="input-otp"
				style="position: absolute; inset: 0; width: 100%; height: 100%; display: flex; textAlign: left; opacity: 1; color: transparent; pointerEvents: all; background: transparent; caret-color: transparent; border: 0px solid transparent; outline: transparent solid 0px; box-shadow: none; line-height: 1; letter-spacing: -0.5em; font-family: monospace; font-variant-numeric: tabular-nums;"
				[disabled]="state().disabled()"
				[inputMode]="inputMode()"
				[ngModel]="value()"
				(input)="onInputChange($event)"
				(focus)="focused.set(true)"
				(blur)="focused.set(false)"
			/>
		</div>
	`,
	host: {
		style: 'position: relative; cursor: text; user-select: none; pointer-events: none;',
		'data-input-otp-container': 'true',
	},
	providers: [BRN_INPUT_OTP_VALUE_ACCESSOR, provideBrnInputOtp(BrnInputOtpComponent)],
})
export class BrnInputOtpComponent implements ControlValueAccessor {
	protected readonly focused = signal<boolean>(false);

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly maxLength = input.required<number, NumberInput>({ transform: numberAttribute });

	public readonly inputMode = input<InputMode>('numeric');

	public readonly inputClass = input<string>('');

	public readonly value = model('');

	public readonly context = computed(() => {
		const value = this.value();
		const focused = this.focused();
		const maxLength = this.maxLength();
		const slots = Array.from({ length: this.maxLength() }).map((_, slotIndex) => {
			const char = value[slotIndex] !== undefined ? value[slotIndex] : null;

			const isActive =
				focused && (value.length === slotIndex || (value.length === maxLength && slotIndex === maxLength - 1));

			return {
				char,
				isActive,
				hasFakeCaret: isActive && value.length === slotIndex,
			};
		});

		return slots;
	});

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	protected _onChange?: ChangeFn<string>;
	protected _onTouched?: TouchFn;

	onInputChange(event: Event) {
		let newValue = (event.target as HTMLInputElement).value;
		const maxLength = this.maxLength();

		if (newValue.length > maxLength) {
			// Replace the last character when max length is exceeded
			newValue = newValue.slice(0, maxLength - 1) + newValue.slice(-1);
		}

		this.value.set(newValue);
		this._onChange?.(newValue);
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: string | null): void {
		// optional FormControl is initialized with null value
		if (value === null) return;

		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<string>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}
}
