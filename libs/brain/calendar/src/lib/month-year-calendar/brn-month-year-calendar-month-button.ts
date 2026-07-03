import { computed, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarMonthButton]',
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
		'(click)': '_monthYear.selectMonth(date())',
		'(keydown.arrowLeft)': 'focusOffset($event, getDirection() === "rtl" ? 1 : -1)',
		'(keydown.arrowRight)': 'focusOffset($event, getDirection() === "rtl" ? -1 : 1)',
		'(keydown.arrowUp)': 'focusOffset($event, -4)',
		'(keydown.arrowDown)': 'focusOffset($event, 4)',
		'(keydown.home)': 'focusMonth($event, 0)',
		'(keydown.end)': 'focusMonth($event, 11)',
		'(keydown.pageUp)': 'focusYearOffset($event, -1)',
		'(keydown.pageDown)': 'focusYearOffset($event, 1)',
	},
})
export class BrnMonthYearCalendarMonthButton<T> {
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the month/year selector */
	protected readonly _monthYear = injectBrnMonthYearCalendar<T>();

	/** Access the element ref */
	private readonly _elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

	private readonly _destroyRef = inject(DestroyRef);

	/** The month this cell represents. */
	public readonly date = input.required<T>();

	/** Expose the value for the month/year selector's focus tracking. */
	public readonly value = this.date;

	public readonly selected = computed(() => this._monthYear.isMonthSelected(this.date()));
	public readonly today = computed(() => this._monthYear.isMonthToday(this.date()));
	public readonly disabled = computed(() => this._monthYear.isMonthDisabled(this.date()));

	public readonly focusable = computed(
		() =>
			this._dateAdapter.isSameMonth(this._monthYear.focusedDate(), this.date()) &&
			this._dateAdapter.isSameYear(this._monthYear.focusedDate(), this.date()),
	);

	constructor() {
		this._monthYear.registerCell(this);
		this._destroyRef.onDestroy(() => this._monthYear.unregisterCell(this));
	}

	protected focusOffset(event: Event, offset: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._monthYear.setFocusedMonth(this._dateAdapter.add(this._monthYear.focusedDate(), { months: offset }));
	}

	protected focusMonth(event: Event, month: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._monthYear.setFocusedMonth(this._dateAdapter.set(this._monthYear.focusedDate(), { month, day: 1 }));
	}

	protected focusYearOffset(event: Event, offset: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._monthYear.setFocusedMonth(this._dateAdapter.add(this._monthYear.focusedDate(), { years: offset }));
	}

	protected getDirection(): 'ltr' | 'rtl' {
		return getComputedStyle(this._elementRef.nativeElement).direction === 'rtl' ? 'rtl' : 'ltr';
	}

	focus(): void {
		this._elementRef.nativeElement.focus();
	}
}
