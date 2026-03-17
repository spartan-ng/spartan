import { afterNextRender, Directive, ElementRef, inject, signal } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

const SCROLLBY_PIXEL = 50;

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
			behavior: 'smooth',
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
			behavior: 'smooth',
		});

		if (this._elementRef.nativeElement.scrollTop === 0) {
			stop();
		}
	}
}
