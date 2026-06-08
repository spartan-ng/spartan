import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

/**
 * The draggable container element of the drawer.
 *
 * Registers itself with the parent `BrnDrawer` so the coordinator can attach
 * a `ResizeObserver` to track the sheet height and read `getBoundingClientRect()`
 * during the opening transition. Host bindings apply the current Y transform,
 * height, and max-height from the coordinator's computed signals.
 */
@Directive({
	selector: '[brnDrawerContent]',
	host: {
		'[style.transform]': '_drawer.containerTransform()',
		'[style.height]': '_drawer.containerHeight()',
		'[style.max-height]': '_drawer.containerMaxHeight()',
	},
})
export class BrnDrawerContent {
	protected readonly _drawer = inject(BrnDrawer);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._drawer.registerContainer(this._el);
		inject(DestroyRef).onDestroy(() => this._drawer.registerContainer(null));
	}
}
