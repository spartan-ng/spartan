import { DestroyRef, Directive, ElementRef, computed, inject, input } from '@angular/core';
import { BrnAvatar } from '../brn-avatar';

@Directive({
	selector: 'img[brnAvatarImage]',
	exportAs: 'brnAvatarImage',
	host: {
		'[style]': 'hostStyles()',
		'[style.visibility]': "canShow() ? null : 'hidden'",
		'(load)': '_onLoad()',
		'(error)': '_onError()',
	},
})
export class BrnAvatarImage {
	private readonly _avatar = inject(BrnAvatar);
	private readonly _image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
	private readonly _destroyRef = inject(DestroyRef);

	/**
	 * Styles applied to the host element. Bound via `[style]` so they apply through the CSSOM and are
	 * not blocked by a strict Content-Security-Policy.
	 */
	public readonly hostStyles = input<string>('position: absolute; inset: 0; width: 100%; height: 100%');

	public readonly canShow = computed(() => this._avatar.status() === 'loaded');

	constructor() {
		// The image may already be loaded before this directive is created, e.g. during hydration
		// or when a cached image is reused. In that case the load event will never fire.
		if (this._image.complete && this._image.naturalWidth > 0) {
			this._onLoad();
		} else {
			this._avatar.setStatus('loading');
		}

		// If the image is removed, the fallback should become visible again.
		this._destroyRef.onDestroy(() => {
			if (this._avatar.status() !== 'idle') {
				this._avatar.setStatus('idle');
			}
		});
	}

	protected _onError(): void {
		this._avatar.setStatus('error');
	}

	protected _onLoad(): void {
		this._avatar.setStatus('loaded');
	}
}
