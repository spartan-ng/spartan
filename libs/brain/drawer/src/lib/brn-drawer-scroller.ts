import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

/**
 * The scrollable body of the drawer. Registers itself so the coordinator can:
 *
 * - attach a second `DragGesture` that arbitrates between native scroll and
 *   drag-to-dismiss (using the `memo` pattern to defer the decision until
 *   direction is known);
 * - attach a `scrollTracker` signal for the "can we take over the gesture?"
 *   decision (only when `scrollTop === 0`);
 * - observe async content changes via a `MutationObserver` to refresh
 *   `touch-action` before the next touch.
 *
 * Host bindings apply the dynamic `touch-action` and `padding-bottom` from
 * the coordinator's computed signals.
 */
@Directive({
	selector: '[brnDrawerScroller]',
	host: {
		'[style.touch-action]': '_drawer.scrollerTouchAction()',
		'[style.padding-bottom]': '_drawer.scrollerPaddingBottom()',
		'[style.max-height]': '_drawer.scrollerMaxHeight()',
	},
})
export class BrnDrawerScroller {
	protected readonly _drawer = inject(BrnDrawer);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._drawer.registerScroller(this._el);
		inject(DestroyRef).onDestroy(() => this._drawer.registerScroller(null));
	}
}
