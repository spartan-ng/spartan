import { computed, Directive, inject, input } from '@angular/core';
import { BrnAvatar } from '../brn-avatar';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'brnAvatarFallback',
	host: {
		'[style]': 'hostStyles()',
		'[style.display]': "_hidden() ? 'none' : null",
	},
})
export class BrnAvatarFallback {
	/**
	 * Styles applied to the host element. Bound via `[style]` so they apply through the CSSOM and are
	 * not blocked by a strict Content-Security-Policy.
	 */
	public readonly hostStyles = input<string>('grid-area: 1 / 1');

	private readonly _avatar = inject(BrnAvatar);
	protected readonly _hidden = computed(() => this._avatar.status() === 'loaded');
}
