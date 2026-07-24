import { computed, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { YEARS_PER_PAGE } from './brn-month-year-calendar';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarYearButton]',
	host: {
		role: 'gridcell',
		type: 'button',
		'[tabindex]': 'focusable() ? 0 : -1',
		'[attr.data-selected]': 'selected() ? true : null',
		'[attr.data-today]': 'today() && !selected() ? true : null',
		'[attr.data-focused]': 'focusable() ? true : null',
		'[attr.data-disabled]': 'disabled() ? true : null',
		'[attr.aria-selected]': 'selected() ? true : null',
		'[attr.aria-disabled]': 'disabled() ? true : null',
		'[disabled]': 'disabled()',
		'(click)': '_monthYear.selectYear(date())',
		'(keydown.arrowLeft)': 'focusOffset($event, getDirection() === "rtl" ? 1 : -1)',
		'(keydown.arrowRight)': 'focusOffset($event, getDirection() === "rtl" ? -1 : 1)',
		'(keydown.arrowUp)': 'focusOffset($event, -4)',
		'(keydown.arrowDown)': 'focusOffset($event, 4)',
		'(keydown.home)': 'focusYear($event, _monthYear.yearRange().start)',
		'(keydown.end)': 'focusYear($event, _monthYear.yearRange().end)',
		'(keydown.pageUp)': 'focusOffset($event, -_yearsPerPage)',
		'(keydown.pageDown)': 'focusOffset($event, _yearsPerPage)',
	},
})
export class BrnMonthYearCalendarYearButton<T> {
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the month/year selector */
	protected readonly _monthYear = injectBrnMonthYearCalendar<T>();

	/** Access the element ref */
	private readonly _elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

	private readonly _destroyRef = inject(DestroyRef);

	/** The year this cell represents. */
	public readonly date = input.required<T>();

	/** Expose the value for the month/year selector's focus tracking. */
	public readonly value = this.date;

	public readonly selected = computed(() => this._monthYear.isYearSelected(this.date()));
	public readonly today = computed(() => this._monthYear.isYearToday(this.date()));
	public readonly disabled = computed(() => this._monthYear.isYearDisabled(this.date()));

	public readonly focusable = computed(() => this._dateAdapter.isSameYear(this._monthYear.focusedDate(), this.date()));

	protected readonly _yearsPerPage = YEARS_PER_PAGE;

	constructor() {
		this._monthYear.registerCell(this);
		this._destroyRef.onDestroy(() => this._monthYear.unregisterCell(this));
	}

	protected focusOffset(event: Event, offset: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._monthYear.setFocusedYear(this._dateAdapter.add(this._monthYear.focusedDate(), { years: offset }));
	}

	protected focusYear(event: Event, year: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._monthYear.setFocusedYear(this._dateAdapter.set(this._monthYear.focusedDate(), { year }));
	}

	protected getDirection(): 'ltr' | 'rtl' {
		return getComputedStyle(this._elementRef.nativeElement).direction === 'rtl' ? 'rtl' : 'ltr';
	}

	focus(): void {
		this._elementRef.nativeElement.focus();
	}
}
