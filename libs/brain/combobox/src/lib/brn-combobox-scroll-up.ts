import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrnComboboxList } from './brn-combobox-list';

@Directive({
	selector: '[brnComboboxScrollUp], brn-combobox-scroll-up',
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
		'[style.display]': '_comboboxList?.canScrollUp() ? \"flex\" : \"none\"',
	},
})
export class BrnComboboxScrollUp {
	private readonly _el = inject(ElementRef);
	protected readonly _comboboxList = inject(BrnComboboxList, { optional: true });

	private readonly _endReached = new Subject<boolean>();
	private readonly _destroyRef = inject(DestroyRef);

	public startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this._comboboxList?.moveFocusUp();
				// Use afterNextRender or a tiny timeout to check state if needed, or just let handleScroll update it.
				// Since smooth scrolling takes time, handleScroll() on the list will update `canScrollUp` asynchronously.
				// Let's just check the state directly or rely on the host hiding us via `canScrollUp()` false.
			});
	}

	public stopEmittingEvents(): void {
		this._endReached.next(true);
	}
}
