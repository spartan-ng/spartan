import { Directive, inject } from '@angular/core';
import { BrnDrawerSwipeArea, type BrnDrawerSwipeDirection } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/helm/utils';

// Keyed by the opening direction: the strip sits on the opposite edge. Plain utilities (no data-*
// variants), so classes set on the element override them.
const EDGE_CLASSES: Record<BrnDrawerSwipeDirection, string> = {
	up: 'inset-x-0 bottom-0 h-8',
	down: 'inset-x-0 top-0 h-8',
	left: 'inset-y-0 right-0 w-8',
	right: 'inset-y-0 left-0 w-8',
};

/** An invisible strip at the screen edge the drawer comes from, swiped to open the drawer. */
@Directive({
	selector: '[hlmDrawerSwipeArea],hlm-drawer-swipe-area',
	exportAs: 'hlmDrawerSwipeArea',
	hostDirectives: [{ directive: BrnDrawerSwipeArea, inputs: ['disabled', 'swipeDirection'] }],
	host: { 'data-slot': 'drawer-swipe-area' },
})
export class HlmDrawerSwipeArea {
	private readonly _swipeArea = inject(BrnDrawerSwipeArea);

	constructor() {
		classes(() => ['fixed z-40 select-none', EDGE_CLASSES[this._swipeArea.resolvedSwipeDirection()]]);
	}
}
