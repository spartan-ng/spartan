import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	contentChild,
	Directive,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	numberAttribute,
	output,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnCalendarCellButton } from '../brn-calendar-cell-button';
import { BrnCalendarHeader } from '../brn-calendar-header';
import { type BrnCalendarBase, type BrnCalendarMonthData, provideBrnCalendar } from '../brn-calendar.token';
import { injectBrnCalendarI18n, type Weekday } from '../i18n/calendar-i18n';
import { compareDays } from '../utils/compare-days';
import { findInitialFocusedDate } from '../utils/find-enabled-date';

@Directive({
	selector: '[brnCalendarRange]',
	exportAs: 'brnCalendarRange',
	providers: [provideBrnCalendar(BrnCalendarRange)],
})
export class BrnCalendarRange<T> implements BrnCalendarBase<T> {
	private readonly _cells: BrnCalendarCellButton<T>[] = [];

	private readonly _i18n = injectBrnCalendarI18n();
	// /** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the injector */
	private readonly _injector = inject(Injector);

	/** The days to highlight. */
	public readonly highlightDays = input<T[]>([]);

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput | undefined>(undefined, {
		transform: (v: unknown) => (v === undefined || v === null ? undefined : (numberAttribute(v) as Weekday)),
	});

	protected readonly _weekStartsOn = computed(() => this.weekStartsOn() ?? this._i18n.config().firstDayOfWeek());

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** The number of months to display. */
	public readonly numberOfMonths = input<number, NumberInput>(1, {
		transform: (value) => Math.max(1, Math.floor(numberAttribute(value, 1))),
	});

	/** @internal Access the header */
	public readonly header = contentChild(BrnCalendarHeader);

	/**
	 * The focused date.
	 */
	public readonly focusedDate = linkedSignal({
		source: () => ({
			initialDate: this.constrainDate(this.defaultFocusedDate() ?? this.startDate() ?? this._dateAdapter.now()),
			startingDate: this.defaultFocusedDate(),
			selectedDate: this.startDate(),
			min: this.min(),
			max: this.max(),
			disabled: this.disabled(),
			dateDisabled: this.dateDisabled(),
		}),
		computation: (source, previous): T => {
			if (source.disabled) return source.initialDate;
			// Availability changes must not reset keyboard focus to the default date.
			// A new initial date or changed limits should still reset it.
			const preserveFocus =
				previous !== undefined &&
				previous.source.startingDate === source.startingDate &&
				previous.source.selectedDate === source.selectedDate &&
				previous.source.min === source.min &&
				previous.source.max === source.max &&
				previous.source.disabled === source.disabled;
			const target: T = preserveFocus ? (previous.value as T) : source.initialDate;
			return findInitialFocusedDate(target, this._dateAdapter, (day) => this.isDateDisabled(day), {
				min: source.min,
				max: source.max,
			});
		},
	});

	/** Emits whenever the focused date changes. */
	public readonly focusedDateChange = output<T>();

	private _setFocusedDate(date: T): void {
		this.focusedDate.set(date);
		this.focusedDateChange.emit(date);
	}

	/**
	 * The selected start date
	 */
	public readonly startDate = model<T>();

	/**
	 * The selected end date
	 */
	public readonly endDate = model<T>();

	/**
	 * The first displayed month. It only moves when the focused date leaves the displayed months,
	 * so navigating within the displayed months does not shift them.
	 */
	private readonly _firstMonth = linkedSignal<{ focusedDate: T; numberOfMonths: number }, T>({
		source: () => ({ focusedDate: this.focusedDate(), numberOfMonths: this.numberOfMonths() }),
		computation: ({ focusedDate, numberOfMonths }, previous): T => {
			const focusedMonth = this._dateAdapter.startOfMonth(focusedDate);

			if (!previous) {
				return focusedMonth;
			}

			const offset = this._monthDifference(previous.value, focusedMonth);

			if (offset < 0) {
				return focusedMonth;
			}

			if (offset >= numberOfMonths) {
				return this._dateAdapter.subtract(focusedMonth, { months: numberOfMonths - 1 });
			}

			return previous.value;
		},
		equal: (a, b) => this._dateAdapter.isSameMonth(a, b),
	});

	/** The months to display, starting with the first displayed month. */
	public readonly months = computed<BrnCalendarMonthData<T>[]>(() => {
		const firstMonth = this._firstMonth();

		return Array.from({ length: this.numberOfMonths() }, (_, offset) => {
			const month = this._dateAdapter.add(firstMonth, { months: offset });
			return { month, days: this._getDays(month) };
		});
	});

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	public readonly days = computed(() => this._getDays(this.focusedDate()), {
		equal: (a, b) => compareDays(a, b, this._dateAdapter),
	});

	/** Show the month of the given date at the given offset of the displayed months. */
	showMonth(date: T, offset: number): void {
		const month = this._dateAdapter.startOfMonth(date);
		this._firstMonth.set(this._dateAdapter.subtract(month, { months: offset }));
	}

	private _monthDifference(from: T, to: T): number {
		return (
			(this._dateAdapter.getYear(to) - this._dateAdapter.getYear(from)) * 12 +
			this._dateAdapter.getMonth(to) -
			this._dateAdapter.getMonth(from)
		);
	}

	/** Get the days of the month of the given date, padded to full weeks. */
	private _getDays(month: T): T[] {
		const weekStartsOn = this._weekStartsOn();
		const days: T[] = [];

		// Get the first and last day of the month.
		let firstDay = this._dateAdapter.startOfMonth(month);
		let lastDay = this._dateAdapter.endOfMonth(month);

		// we need to subtract until we get the to starting day before or on the start of the month.
		while (this._dateAdapter.getDay(firstDay) !== weekStartsOn) {
			firstDay = this._dateAdapter.subtract(firstDay, { days: 1 });
		}

		const weekEndsOn = (weekStartsOn + 6) % 7;

		// we need to add until we get to the ending day after or on the end of the month.
		while (this._dateAdapter.getDay(lastDay) !== weekEndsOn) {
			lastDay = this._dateAdapter.add(lastDay, { days: 1 });
		}

		// collect all the days to display.
		while (firstDay <= lastDay) {
			days.push(firstDay);
			firstDay = this._dateAdapter.add(firstDay, { days: 1 });
		}

		return days;
	}

	isSelected(date: T): boolean {
		const start = this.startDate();
		const end = this.endDate();

		if (!start && !end) {
			return false;
		}
		const isStartSelected = start ? this._dateAdapter.isSameDay(date, start) : false;
		const isEndSelected = end ? this._dateAdapter.isSameDay(date, end) : false;

		return isStartSelected || isEndSelected;
	}

	selectDate(date: T): void {
		const start = this.startDate();
		const end = this.endDate();

		if (!start && !end) {
			this.startDate.set(date);

			return;
		}

		if (start && !end) {
			if (this._dateAdapter.isAfter(date, start)) {
				this.endDate.set(date);
			} else if (this._dateAdapter.isBefore(date, start)) {
				this.startDate.set(date);
				this.endDate.set(start);
			} else if (this._dateAdapter.isSameDay(date, start)) {
				this.endDate.set(date);
			}
			return;
		}

		// If both start and end are selected, reset selection
		this.startDate.set(date);

		this.endDate.set(undefined);
	}

	// same as in brn-calendar.directive.ts
	/** @internal Constrain a date to the min and max boundaries */
	constrainDate(date: T): T {
		const min = this.min();
		const max = this.max();

		// If there is no min or max, return the date.
		if (!min && !max) {
			return date;
		}

		// If there is a min and the date is before the min, return the min.
		if (min && this._dateAdapter.isBefore(date, this._dateAdapter.startOfDay(min))) {
			return min;
		}

		// If there is a max and the date is after the max, return the max.
		if (max && this._dateAdapter.isAfter(date, this._dateAdapter.endOfDay(max))) {
			return max;
		}

		// Return the date.
		return date;
	}

	/** @internal Determine if a date is disabled */
	isDateDisabled(date: T): boolean {
		// if the calendar is disabled we can't select this date
		if (this.disabled()) {
			return true;
		}

		// if the date is outside the min and max range
		const min = this.min();
		const max = this.max();

		if (min && this._dateAdapter.isBefore(date, this._dateAdapter.startOfDay(min))) {
			return true;
		}

		if (max && this._dateAdapter.isAfter(date, this._dateAdapter.endOfDay(max))) {
			return true;
		}

		// if this specific date is disabled
		const disabledFn = this.dateDisabled();

		if (disabledFn(date)) {
			return true;
		}

		return false;
	}

	/** @internal Set the focused date */
	setFocusedDate(date: T): void {
		// check if the date is disabled.
		if (this.isDateDisabled(date)) {
			return;
		}

		this._setFocusedDate(date);

		// wait until the cells have all updated

		afterNextRender(
			{
				write: () => {
					const cell = this._cells.find((c) => !c.outside() && this._dateAdapter.isSameDay(c.date(), date));
					if (cell) {
						cell.focus();
					}
				},
			},
			{
				injector: this._injector,
			},
		);

		// we must update the view to ensure the focused cell is visible.
		this._changeDetector.detectChanges();
	}

	/**
	 * Determine if a date is the start of a range.
	 * @param date The date to check.
	 * @returns Always false.
	 * @internal
	 */
	isStartOfRange(date: T): boolean {
		const start = this.startDate();
		return start ? this._dateAdapter.isSameDay(date, start) : false;
	}

	/**
	 * Determine if a date is the end of a range.
	 * @param date The date to check.
	 * @returns Always false.
	 * @internal
	 */
	isEndOfRange(date: T): boolean {
		const end = this.endDate();
		return end ? this._dateAdapter.isSameDay(date, end) : false;
	}

	/**
	 * Determine if a date is between the start and end dates.
	 * @param date The date to check.
	 * @returns True if the date is between the start and end dates, false otherwise.
	 * @internal
	 */
	isBetweenRange(date: T): boolean {
		const start = this.startDate();
		const end = this.endDate();

		if (!start || !end) {
			return false;
		}

		return (
			this._dateAdapter.isAfter(date, start) &&
			this._dateAdapter.isBefore(date, end) &&
			!this._dateAdapter.isSameDay(date, start) &&
			!this._dateAdapter.isSameDay(date, end)
		);
	}

	unregisterCalendarCell(cell: BrnCalendarCellButton<T>): void {
		const index = this._cells.indexOf(cell);
		if (index !== -1) {
			this._cells.splice(index, 1);
		}
	}
	registerCalendarCell(cell: BrnCalendarCellButton<T>): void {
		this._cells.push(cell);
	}
}
