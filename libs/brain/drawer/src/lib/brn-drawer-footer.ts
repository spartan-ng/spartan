import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

/**
 * The fixed footer that stays pinned to the bottom of the visible drawer
 * area at every snap point. Registers itself so the coordinator can measure
 * its height (via `ResizeObserver`, for scroller padding) and bind its
 * `bottom` offset to the current Y translation (counter-transforming against
 * the container's slide).
 */
@Directive({
	selector: '[brnDrawerFooter]',
	host: {
		'[style.bottom.px]': '_drawer.footerBottomPx()',
	},
})
export class BrnDrawerFooter {
	protected readonly _drawer = inject(BrnDrawer);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._drawer.registerFooter(this._el);
		inject(DestroyRef).onDestroy(() => this._drawer.registerFooter(null));
	}
}
