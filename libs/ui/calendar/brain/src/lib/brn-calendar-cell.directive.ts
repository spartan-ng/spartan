import { Directive, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { BrnCalendarService } from './brn-calendar.service';

@Directive({
	selector: 'brnCalendarCell',
	standalone: true,
	host: {
		'[tabIndex]': 'selected() ? 0 : -1',
		'[attr.aria-selected]': 'selected()',
		role: 'gridcell',
		type: 'button',
	},
})
export class BrnCalendarCellDirective {
	private _brnCalendarService = inject(BrnCalendarService);

	protected selected = computed(() => {
		if (this._brnCalendarService.view() === 'days') {
			return this._brnCalendarService.areDatesEqual(this._brnCalendarService.selectedDate(), this.value());
		}
		return false;
	});

	value = input<Date | null>(null);

	constructor() {
		rxHostPressedListener()
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.handleSelection());
	}

	// FIXME: add a type
	// Selection could be year/month/day
	private handleSelection(): void {
		this._brnCalendarService.updateSelection(this.value());
	}
}
