import { computed, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { injectBrnInputOtp } from './brn-input-otp.token';

export type InputMode = 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

const DEFAULT_INPUT_STYLES =
	'position: absolute; inset: 0; width: 100%; height: 100%; display: flex; textAlign: left; opacity: 1; color: transparent; pointerEvents: all; background: transparent; caret-color: transparent; border: 0px solid transparent; outline: transparent solid 0px; box-shadow: none; line-height: 1; letter-spacing: -0.5em; font-family: monospace; font-variant-numeric: tabular-nums;';

@Directive({
	selector: 'input[brnInputOtpInput]',
	exportAs: 'brnInputOtpInput',
	host: {
		'data-slot': 'input-otp',
		'[id]': '_otp.inputId()',
		'[attr.autocomplete]': 'autocomplete()',
		'[attr.inputmode]': 'inputMode()',
		'[disabled]': '_otp.disabledState()',
		'[value]': '_otp.value() ?? ""',
		'[style]': '_inputStyles()',
		'(input)': 'onInputChange($event)',
		'(paste)': 'onPaste($event)',
		'(focus)': '_otp.onFocus()',
		'(blur)': '_otp.onBlur()',
	},
})
export class BrnInputOtpInput {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	protected readonly _otp = injectBrnInputOtp();

	/** Custom autocomplete attribute applied to the input element */
	public readonly autocomplete = input<'one-time-code' | 'off'>('one-time-code');

	/** Virtual keyboard appearance on mobile */
	public readonly inputMode = input<InputMode>('numeric');

	/** Styles applied to the input element to make it invisible and clickable. */
	public readonly inputStyles = input<string | undefined>(undefined);

	protected readonly _inputStyles = computed(() => this.inputStyles() ?? DEFAULT_INPUT_STYLES);

	constructor() {
		this._otp.registerInput(this);
		this._destroyRef.onDestroy(() => this._otp.unregisterInput(this));
	}

	/** Focus the underlying input element. */
	public focus(): void {
		this._elementRef.nativeElement.focus();
	}

	protected onInputChange(event: Event): void {
		let newValue = (event.target as HTMLInputElement).value;
		const length = this._otp.length();

		if (newValue.length > length) {
			// Replace the last character when length is exceeded
			newValue = newValue.slice(0, length - 1) + newValue.slice(-1);
		}

		this._otp.updateValue(newValue);
	}

	protected onPaste(event: ClipboardEvent): void {
		event.preventDefault();
		const clipboardData = event.clipboardData?.getData('text/plain') || '';
		const length = this._otp.length();

		const content = this._otp.transformPaste()(clipboardData, length);
		const newValue = content.slice(0, length);

		this._otp.updateValue(newValue);
	}
}
