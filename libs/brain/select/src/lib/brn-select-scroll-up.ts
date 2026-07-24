import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrnSelectContent } from './brn-select-content';

@Directive({
	selector: '[brnSelectScrollUp]',
	host: {
		'aria-hidden': 'true',
		'[attr.data-hidden]': '!_showScrollUp() ? "" : null',
		'(mouseenter)': '_scrollUp()',
	},
})
export class BrnSelectScrollUp {
	private readonly _el = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _selectContent = inject(BrnSelectContent);

	protected readonly _showScrollUp = this._selectContent.showScrollUp;

	private readonly _endReached = new Subject<boolean>();

	protected _scrollUp() {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		// 15ms is slightly faster than 60fps (16.6ms), ensuring a smooth animation loop.
		interval(15)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.scrollUp(() => this._endReached.next(true)));
	}
}
