import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
	name: 'maskValue',
	pure: false /** Impure so the view can update after the timeout triggers. */,
})
export class MaskValuePipe implements PipeTransform, OnDestroy {
	private readonly _cdr = inject(ChangeDetectorRef);

	/** Last value/mask pair seen by the pipe. Used to detect a newly typed character. */
	private _lastValue: unknown;
	private _lastMask = false;

	/** Whether the currently tracked value should be rendered masked. */
	private _shouldMaskNow = false;

	/** Active timer that flips `_shouldMaskNow` after `delayMs`. */
	private _timeoutId: ReturnType<typeof setTimeout> | null = null;

	transform(value: unknown, mask = false, delayMs = 200): unknown {
		/** If masking is disabled or value is empty/falsy, return raw value immediately. */
		if (!mask || !value) {
			this._clearTimer();
			this._lastValue = value;
			this._lastMask = mask;
			this._shouldMaskNow = false;
			return value;
		}

		/** New value (or mask toggled on): briefly show plain value, then mask after delay. */
		if (value !== this._lastValue || !this._lastMask) {
			this._clearTimer();
			this._lastValue = value;
			this._lastMask = mask;
			this._shouldMaskNow = false;

			this._timeoutId = setTimeout(() => {
				this._shouldMaskNow = true;
				/** Required because host component uses OnPush and this pipe is timer-driven. */
				this._cdr.markForCheck();
			}, delayMs);

			return value;
		}

		/** Same value path: return masked or unmasked based on timer state. */
		return this._shouldMaskNow ? '\u2217' : value;
	}

	ngOnDestroy(): void {
		/** Prevent timer leaks when pipe instance is destroyed. */
		this._clearTimer();
	}

	private _clearTimer(): void {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}
	}
}
