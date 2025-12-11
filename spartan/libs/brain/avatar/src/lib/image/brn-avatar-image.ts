import { Directive, computed, signal } from '@angular/core';

@Directive({
	selector: 'img[brnAvatarImage]',
	exportAs: 'avatarImage',
	host: {
		'(load)': '_onLoad()',
		'(error)': '_onError()',
	},
})
export class BrnAvatarImage {
	private readonly _loaded = signal(false);

	protected _onError() {
		this._loaded.set(false);
	}

	protected _onLoad() {
		this._loaded.set(true);
	}

	public readonly canShow = computed(() => this._loaded());
}
