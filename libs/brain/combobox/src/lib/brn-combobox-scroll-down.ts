import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrnComboboxList } from './brn-combobox-list';

@Directive({
	selector: '[brnComboboxScrollDown], brn-combobox-scroll-down',
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
		'[style.display]': '_comboboxList?.canScrollDown() ? \"flex\" : \"none\"',
	},
})
export class BrnComboboxScrollDown {
	private readonly _el = inject(ElementRef);
	protected readonly _comboboxList = inject(BrnComboboxList, { optional: true });

	private readonly _endReached = new Subject<boolean>();
	private readonly _destroyRef = inject(DestroyRef);

	public startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this._comboboxList?.moveFocusDown();
			});
	}

	public stopEmittingEvents(): void {
		this._endReached.next(true);
	}
}
