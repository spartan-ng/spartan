import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { booleanAttribute, DestroyRef, Directive, effect, inject, input, numberAttribute } from '@angular/core';
import { BrnMessageScroller } from './brn-message-scroller';
import { provideBrnMessageScroller } from './brn-message-scroller.token';
import type { BrnMessageScrollerDefaultScrollPosition } from './brn-message-scroller.types';
import {
	DEFAULT_SCROLL_EDGE_THRESHOLD,
	DEFAULT_SCROLL_MARGIN,
	DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
} from './brn-message-scroller.types';

@Directive({
	selector: '[brnMessageScrollerProvider]',
	exportAs: 'brnMessageScrollerProvider',
	providers: [BrnMessageScroller, provideBrnMessageScroller(BrnMessageScroller)],
})
export class BrnMessageScrollerProvider {
	private readonly _scroller = inject(BrnMessageScroller);
	private readonly _destroyRef = inject(DestroyRef);

	/**
	 * Follow new content at the bottom while the viewport is already at the end.
	 * @default false
	 */
	public readonly autoScroll = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Opening position on the first non-empty render, applied once.
	 * @default 'end'
	 */
	public readonly defaultScrollPosition = input<BrnMessageScrollerDefaultScrollPosition>('end');

	/**
	 * Distance from an edge that still counts as at-top/at-bottom.
	 * @default 8
	 */
	public readonly scrollEdgeThreshold = input<number, NumberInput>(DEFAULT_SCROLL_EDGE_THRESHOLD, {
		transform: numberAttribute,
	});

	/**
	 * Extra top margin for a newly anchored row, added to scrollMargin.
	 * @default 64
	 */
	public readonly scrollPreviousItemPeek = input<number, NumberInput>(DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK, {
		transform: numberAttribute,
	});

	/**
	 * Default margin on the aligned edge for commands and visibility.
	 * @default 0
	 */
	public readonly scrollMargin = input<number, NumberInput>(DEFAULT_SCROLL_MARGIN, {
		transform: numberAttribute,
	});

	constructor() {
		effect(() => {
			this._scroller.configure({
				autoScroll: this.autoScroll(),
				defaultScrollPosition: this.defaultScrollPosition(),
				scrollEdgeThreshold: this.scrollEdgeThreshold(),
				scrollPreviousItemPeek: this.scrollPreviousItemPeek(),
				scrollMargin: this.scrollMargin(),
			});
		});

		this._destroyRef.onDestroy(() => this._scroller.destroy());
	}
}
