import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	selector: 'button[brnCalendarCellButton]',
	host: {
		role: 'gridcell',
		'[tabindex]': 'focusable() ? 0 : -1',
		type: 'button',
		'[attr.data-outside]': "outside() ? '' : null",
		'[attr.data-today]': "today() && !selected() ? '' : null",
		'[attr.data-selected]': "selected() ? '' : null",
		'[attr.data-disabled]': "disabled() ? '' : null",
		'[attr.aria-selected]': "selected() ? 'true' : null",
		'[attr.aria-disabled]': "disabled() ? 'true' : null",
		'[disabled]': 'disabled()',
		'(click)': 'calendar.selectDate(date())',
		'(keydown.arrowLeft)': 'focusPrevious($event)',
		'(keydown.arrowRight)': 'focusNext($event)',
		'(keydown.arrowUp)': 'focusAbove($event)',
		'(keydown.arrowDown)': 'focusBelow($event)',
		'(keydown.home)': 'focusFirst($event)',
		'(keydown.end)': 'focusLast($event)',
		'(keydown.pageUp)': 'focusPreviousMonth($event)',
		'(keydown.pageDown)': 'focusNextMonth($event)',
	},
})
export class BrnCalendarCellButton<T> {
	/** Access the date adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** Access the calendar component */
	protected readonly calendar = injectBrnCalendar<T>();

	/** Access the element ref */
	private readonly _elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

	/** The date this cell represents */
	public readonly date = input.required<T>();

	/** Whether this date is currently selected */
	public readonly selected = computed(() => this.calendar.isSelected(this.date()));

	/** Whether this date is focusable */
	public readonly focusable = computed(() => this.dateAdapter.isSameDay(this.calendar.focusedDate(), this.date()));

	public readonly outside = computed(() => {
		const focusedDate = this.calendar.focusedDate();
		return !this.dateAdapter.isSameMonth(this.date(), focusedDate);
	});

	/** Whether this date is today */
	public readonly today = computed(() => this.dateAdapter.isSameDay(this.date(), this.dateAdapter.now()));

	/** Whether this date is disabled */
	public readonly disabled = computed(() => this.calendar.isDateDisabled(this.date()) || this.calendar.disabled());

	/**
	 * Focus the previous cell.
	 */
	protected focusPrevious(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		// in rtl, the arrow keys are reversed.
		const targetDate = this.dateAdapter.add(this.calendar.focusedDate(), {
			days: this.getDirection() === 'rtl' ? 1 : -1,
		});

		this.calendar.setFocusedDate(targetDate);
	}

	/**
	 * Focus the next cell.
	 */
	protected focusNext(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const targetDate = this.dateAdapter.add(this.calendar.focusedDate(), {
			days: this.getDirection() === 'rtl' ? -1 : 1,
		});

		this.calendar.setFocusedDate(targetDate);
	}

	/**
	 * Focus the above cell.
	 */
	protected focusAbove(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.subtract(this.calendar.focusedDate(), { days: 7 }));
	}

	/**
	 * Focus the below cell.
	 */
	protected focusBelow(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.add(this.calendar.focusedDate(), { days: 7 }));
	}

	/**
	 * Focus the first date of the month.
	 */
	protected focusFirst(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.startOfMonth(this.calendar.focusedDate()));
	}

	/**
	 * Focus the last date of the month.
	 */
	protected focusLast(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.endOfMonth(this.calendar.focusedDate()));
	}

	/**
	 * Focus the same date in the previous month.
	 */
	protected focusPreviousMonth(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const date = this.dateAdapter.getDate(this.calendar.focusedDate());

		let previousMonthTarget = this.dateAdapter.startOfMonth(this.calendar.focusedDate());
		previousMonthTarget = this.dateAdapter.subtract(previousMonthTarget, { months: 1 });

		const lastDay = this.dateAdapter.endOfMonth(previousMonthTarget);

		// if we are on a date that does not exist in the previous month, we should focus the last day of the month.
		if (date > this.dateAdapter.getDate(lastDay)) {
			this.calendar.setFocusedDate(lastDay);
		} else {
			this.calendar.setFocusedDate(this.dateAdapter.set(previousMonthTarget, { day: date }));
		}
	}

	/**
	 * Focus the same date in the next month.
	 */
	protected focusNextMonth(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const date = this.dateAdapter.getDate(this.calendar.focusedDate());

		let nextMonthTarget = this.dateAdapter.startOfMonth(this.calendar.focusedDate());
		nextMonthTarget = this.dateAdapter.add(nextMonthTarget, { months: 1 });

		const lastDay = this.dateAdapter.endOfMonth(nextMonthTarget);

		// if we are on a date that does not exist in the next month, we should focus the last day of the month.
		if (date > this.dateAdapter.getDate(lastDay)) {
			this.calendar.setFocusedDate(lastDay);
		} else {
			this.calendar.setFocusedDate(this.dateAdapter.set(nextMonthTarget, { day: date }));
		}
	}

	/**
	 * Get the direction of the element.
	 */
	private getDirection(): 'ltr' | 'rtl' {
		return getComputedStyle(this._elementRef.nativeElement).direction === 'rtl' ? 'rtl' : 'ltr';
	}

	focus(): void {
		this._elementRef.nativeElement.focus();
	}
}
