import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	numberAttribute,
} from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';
import { USER_SCROLL_KEYS } from './brn-message-scroller.types';

@Directive({
	selector: '[brnMessageScrollerViewport],brn-message-scroller-viewport',
	exportAs: 'brnMessageScrollerViewport',
	host: {
		role: 'region',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.tabindex]': 'tabIndex()',
		'(scroll)': 'onScroll()',
		'(wheel)': 'onWheel()',
		'(touchmove)': 'onTouchMove()',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnMessageScrollerViewport {
	private readonly _scroller = injectBrnMessageScroller();

	/**
	 * Keep the first visible messageId row stable on prepend.
	 * @default true
	 */
	public readonly preserveScrollOnPrepend = input<boolean, BooleanInput>(true, {
		transform: booleanAttribute,
	});

	/**
	 * Accessible name for the scroll region.
	 * @default 'Messages'
	 */
	public readonly ariaLabel = input('Messages', { alias: 'aria-label' });

	/**
	 * Tab index for keyboard scrolling.
	 * @default 0
	 */
	public readonly tabIndex = input<number, NumberInput>(0, {
		alias: 'tabindex',
		transform: numberAttribute,
	});

	constructor() {
		const scroller = this._scroller;
		const viewport = inject<ElementRef<HTMLDivElement>>(ElementRef).nativeElement;
		let resizeFrame = 0;
		let resizeObserver: ResizeObserver | null = null;

		scroller.setViewportElement(viewport);

		effect(() => {
			scroller.preserveScrollOnPrepend = this.preserveScrollOnPrepend();
		});

		if (typeof ResizeObserver !== 'undefined') {
			// Coalesce into rAF: handleResize mutates the spacer inside the observed
			// content, and resizing an observed element during delivery fires
			// "ResizeObserver loop completed with undelivered notifications".
			resizeObserver = new ResizeObserver(() => {
				window.cancelAnimationFrame(resizeFrame);
				resizeFrame = window.requestAnimationFrame(() => scroller.handleResize());
			});
			resizeObserver.observe(viewport);
		}

		inject(DestroyRef).onDestroy(() => {
			if (typeof window !== 'undefined') {
				window.cancelAnimationFrame(resizeFrame);
			}
			resizeObserver?.disconnect();
			resizeObserver = null;
			scroller.clearViewportElement(viewport);
		});
	}

	protected onScroll(): void {
		this._scroller.syncAfterScroll();
	}

	protected onWheel(): void {
		this._scroller.userScrollIntent();
	}

	protected onTouchMove(): void {
		this._scroller.userScrollIntent();
	}

	protected onKeyDown(event: KeyboardEvent): void {
		if (USER_SCROLL_KEYS.has(event.key)) {
			this._scroller.userScrollIntent();
		}
	}
}
