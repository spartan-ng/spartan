import { computed, Directive, inject } from '@angular/core';
import { BrnAvatar } from '../brn-avatar';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'brnAvatarFallback',
	host: {
		'[style.visibility]': "_hidden() ? 'hidden' : null",
	},
})
export class BrnAvatarFallback {
	private readonly _avatar = inject(BrnAvatar);
	protected readonly _hidden = computed(() => this._avatar.status() === 'loaded');
}
