import { Directive, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';

@Directive({
	selector: 'img[brnAvatarImage]',
	exportAs: 'brnAvatarImage',
	host: {
		'(load)': '_onLoad()',
		'(error)': '_onError()',
		class: 'absolute inset-0',
		'[class.invisible]': '!canShow()',
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
