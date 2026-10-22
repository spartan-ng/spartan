import { Directive, input, signal } from '@angular/core';

export type BrnAvatarStatus = 'idle' | 'loading' | 'loaded' | 'error';

@Directive({
	selector: '[brnAvatar],brn-avatar',
	exportAs: 'brnAvatar',
	host: {
		'[style]': 'hostStyles()',
		'[attr.data-status]': 'status()',
	},
})
export class BrnAvatar {
	/**
	 * Styles applied to the host element. Bound via `[style]` so they apply through the CSSOM and are
	 * not blocked by a strict Content-Security-Policy.
	 *
	 * The image and fallback share the same grid cell, so only one of them is visible at a time.
	 */
	public readonly hostStyles = input<string>('display: inline-grid; position: relative');

	private readonly _status = signal<BrnAvatarStatus>('idle');
	public readonly status = this._status.asReadonly();

	/** @internal */
	public setStatus(status: BrnAvatarStatus): void {
		this._status.set(status);
	}
}
