import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

/**
 * The drag-grip region at the top of the drawer (usually shows a horizontal
 * indicator). Registers itself so the coordinator can attach a `DragGesture`
 * that resolves drag-to-dismiss / snap-point transitions.
 */
@Directive({
	selector: '[brnDrawerHandle]',
})
export class BrnDrawerHandle {
	private readonly _drawer = inject(BrnDrawer);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._drawer.registerHandle(this._el);
		inject(DestroyRef).onDestroy(() => this._drawer.registerHandle(null));
	}
}
