import { afterNextRender, Directive, ElementRef, inject, signal } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

// We use 8px and 15ms to create a smooth scrolling effect.
// 15ms is slightly faster than 60fps (16.6ms), ensuring a smooth animation loop.
const SCROLLBY_PIXEL = 8;

@Directive({
	selector: '[brnSelectContent]',
	host: {
		'[style.--brn-select-width.px]': '_selectWidth()',
		'(scroll)': 'handleScroll()',
	},
})
export class BrnSelectContent {
	private readonly _select = injectBrnSelectBase();

	protected readonly _selectWidth = this._select.triggerWidth;

	private readonly _elementRef = inject(ElementRef<HTMLElement>);

	private readonly _scrollUp = signal(false);

	public readonly showScrollUp = this._scrollUp.asReadonly();

	private readonly _scrollDown = signal(false);

	public readonly showScrollDown = this._scrollDown.asReadonly();

	constructor() {
		afterNextRender(() => {
			this._checkScroll();
		});
	}

	public handleScroll() {
		this._checkScroll();
	}

	private _checkScroll() {
		const { scrollTop, scrollHeight, clientHeight } = this._elementRef.nativeElement;

		this._scrollUp.set(scrollTop > 0);

		const maxScroll = scrollHeight - clientHeight;
		this._scrollDown.set(Math.ceil(scrollTop) < maxScroll);
	}

	public scrollDown(stop: () => void) {
		this._elementRef.nativeElement.scrollBy({
			top: SCROLLBY_PIXEL,
			behavior: 'auto',
		});

		const { scrollTop, scrollHeight, clientHeight } = this._elementRef.nativeElement;
		const maxScroll = scrollHeight - clientHeight;

		if (Math.ceil(scrollTop) >= maxScroll) {
			stop();
		}
	}

	public scrollUp(stop: () => void) {
		this._elementRef.nativeElement.scrollBy({
			top: -SCROLLBY_PIXEL,
			behavior: 'auto',
		});

		if (this._elementRef.nativeElement.scrollTop === 0) {
			stop();
		}
	}
}
