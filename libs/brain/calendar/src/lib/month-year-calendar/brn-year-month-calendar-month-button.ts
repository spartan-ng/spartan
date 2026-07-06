import { computed, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnYearMonthCalendar } from './brn-year-month-calendar.token';

@Directive({
	selector: 'button[brnYearMonthCalendarMonthButton]',
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
		'(click)': '_yearMonth.selectMonth(date())',
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
export class BrnYearMonthCalendarMonthButton<T> {
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the month/year selector */
	protected readonly _yearMonth = injectBrnYearMonthCalendar<T>();

	/** Access the element ref */
	private readonly _elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

	private readonly _destroyRef = inject(DestroyRef);

	/** The month this cell represents. */
	public readonly date = input.required<T>();

	/** Expose the value for the month/year selector's focus tracking. */
	public readonly value = this.date;

	public readonly selected = computed(() => this._yearMonth.isMonthSelected(this.date()));
	public readonly today = computed(() => this._yearMonth.isMonthToday(this.date()));
	public readonly disabled = computed(() => this._yearMonth.isMonthDisabled(this.date()));

	public readonly focusable = computed(
		() =>
			this._dateAdapter.isSameMonth(this._yearMonth.focusedDate(), this.date()) &&
			this._dateAdapter.isSameYear(this._yearMonth.focusedDate(), this.date()),
	);

	constructor() {
		this._yearMonth.registerCell(this);
		this._destroyRef.onDestroy(() => this._yearMonth.unregisterCell(this));
	}

	protected focusOffset(event: Event, offset: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._yearMonth.setFocusedMonth(this._dateAdapter.add(this._yearMonth.focusedDate(), { months: offset }));
	}

	protected focusMonth(event: Event, month: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._yearMonth.setFocusedMonth(this._dateAdapter.set(this._yearMonth.focusedDate(), { month, day: 1 }));
	}

	protected focusYearOffset(event: Event, offset: number): void {
		event.preventDefault();
		event.stopPropagation();
		this._yearMonth.setFocusedMonth(this._dateAdapter.add(this._yearMonth.focusedDate(), { years: offset }));
	}

	protected getDirection(): 'ltr' | 'rtl' {
		return getComputedStyle(this._elementRef.nativeElement).direction === 'rtl' ? 'rtl' : 'ltr';
	}

	focus(): void {
		this._elementRef.nativeElement.focus();
	}
}
