import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';

@Directive({
	selector: '[brnMessageScroller],brn-message-scroller',
	exportAs: 'brnMessageScroller',
})
export class BrnMessageScrollerRoot {
	private readonly _scroller = injectBrnMessageScroller();
	private readonly _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);

	constructor() {
		const root = this._elementRef.nativeElement;
		this._scroller.setRootElement(root);
		this._destroyRef.onDestroy(() => this._scroller.clearRootElement(root));
	}
}
