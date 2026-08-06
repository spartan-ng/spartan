import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';

@Directive({
	selector: '[brnMessageScroller],brn-message-scroller',
	exportAs: 'brnMessageScroller',
})
export class BrnMessageScrollerRoot {
	constructor() {
		const scroller = injectBrnMessageScroller();
		const root = inject<ElementRef<HTMLDivElement>>(ElementRef).nativeElement;
		scroller.setRootElement(root);
		inject(DestroyRef).onDestroy(() => scroller.clearRootElement(root));
	}
}
