import { Directive, HostListener, computed, signal } from '@angular/core';

@Directive({
	selector: 'img[brnAvatarImage]',
	exportAs: 'avatarImage',
})
export class BrnAvatarImageDirective {
	private readonly _loaded = signal(false);

	@HostListener('error')
	private onError() {
		this._loaded.set(false);
	}

	@HostListener('load')
	private onLoad() {
		this._loaded.set(true);
	}

	public canShow = computed(() => this._loaded());
}
