import { Directive, signal } from '@angular/core';

export type BrnAvatarStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Avatar container. Provides the positioning context for the absolutely positioned image and
 * intentionally does not set `display`.
 */
@Directive({
	selector: '[brnAvatar],brn-avatar',
	exportAs: 'brnAvatar',
	host: {
		'[style.position]': "'relative'",
		'[attr.data-status]': 'status()',
	},
})
export class BrnAvatar {
	private readonly _status = signal<BrnAvatarStatus>('idle');
	public readonly status = this._status.asReadonly();

	/** @internal */
	public setStatus(status: BrnAvatarStatus): void {
		this._status.set(status);
	}
}
