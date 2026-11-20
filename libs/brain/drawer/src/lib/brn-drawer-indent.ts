// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDrawerCssVars } from './brn-drawer-css-vars';
import { BrnDrawerProvider } from './brn-drawer-provider';

/**
 * Wraps the app content that should move back when a drawer opens. Exposes
 * `--drawer-swipe-progress` and `--drawer-height` so it can follow a swipe.
 */
@Directive({
	selector: '[brnDrawerIndent],brn-drawer-indent',
	exportAs: 'brnDrawerIndent',
	host: {
		'[attr.data-active]': '_provider?.active() ? "" : null',
		'[attr.data-inactive]': '_provider?.active() ? null : ""',
	},
})
export class BrnDrawerIndent {
	protected readonly _provider = inject(BrnDrawerProvider, { optional: true });

	constructor() {
		const element: HTMLElement = inject(ElementRef).nativeElement;
		element.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
		const visualStateStore = this._provider?.visualStateStore;
		if (!visualStateStore) return;

		const syncVisualState = () => {
			const { swipeProgress, frontmostHeight } = visualStateStore.getSnapshot();
			element.style.setProperty(BrnDrawerCssVars.swipeProgress, swipeProgress <= 0 ? '0' : `${swipeProgress}`);
			if (frontmostHeight <= 0) {
				element.style.removeProperty(BrnDrawerCssVars.height);
			} else {
				element.style.setProperty(BrnDrawerCssVars.height, `${frontmostHeight}px`);
			}
		};

		syncVisualState();
		const unsubscribe = visualStateStore.subscribe(syncVisualState);
		inject(DestroyRef).onDestroy(() => {
			unsubscribe();
			element.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
			element.style.removeProperty(BrnDrawerCssVars.height);
		});
	}
}
