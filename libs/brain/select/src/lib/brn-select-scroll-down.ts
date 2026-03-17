import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrnSelectContent } from './brn-select-content';

@Directive({
	selector: '[brnSelectScrollDown]',
	host: {
		'aria-hidden': 'true',
		'[attr.data-hidden]': '!_showScrollDown() ? "" : null',
		'(mouseenter)': '_scrollDown()',
	},
})
export class BrnSelectScrollDown {
	private readonly _el = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _selectContent = inject(BrnSelectContent);

	protected readonly _showScrollDown = this._selectContent.showScrollDown;

	private readonly _endReached = new Subject<boolean>();

	protected _scrollDown() {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.scrollDown(() => this._endReached.next(true)));
	}
}
