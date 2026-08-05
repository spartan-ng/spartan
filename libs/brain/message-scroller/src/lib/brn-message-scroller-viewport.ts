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
	private readonly _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private _resizeFrame = 0;
	private _resizeObserver: ResizeObserver | null = null;

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
		const viewport = this._elementRef.nativeElement;
		this._scroller.setViewportElement(viewport);

		effect(() => {
			this._scroller.preserveScrollOnPrepend = this.preserveScrollOnPrepend();
		});

		if (typeof ResizeObserver !== 'undefined') {
			// Coalesce into rAF: handleResize mutates the spacer inside the observed
			// content, and resizing an observed element during delivery fires
			// "ResizeObserver loop completed with undelivered notifications".
			this._resizeObserver = new ResizeObserver(() => {
				window.cancelAnimationFrame(this._resizeFrame);
				this._resizeFrame = window.requestAnimationFrame(() => this._scroller.handleResize());
			});
			this._resizeObserver.observe(viewport);
		}

		this._destroyRef.onDestroy(() => {
			if (typeof window !== 'undefined') {
				window.cancelAnimationFrame(this._resizeFrame);
			}
			this._resizeObserver?.disconnect();
			this._resizeObserver = null;
			this._scroller.clearViewportElement(viewport);
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
