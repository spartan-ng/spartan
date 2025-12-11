import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	contentChild,
	contentChildren,
	Directive,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	numberAttribute,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnCalendarCellButton } from '../brn-calendar-cell-button';
import { BrnCalendarHeader } from '../brn-calendar-header';
import { type BrnCalendarBase, provideBrnCalendar } from '../brn-calendar.token';
import { injectBrnCalendarI18n, type Weekday } from '../i18n/calendar-i18n';

@Directive({
	selector: '[brnCalendarMulti]',
	providers: [provideBrnCalendar(BrnCalendarMulti)],
})
export class BrnCalendarMulti<T> implements BrnCalendarBase<T> {
	private readonly _i18n = injectBrnCalendarI18n();

	/**
	 * Determine if a date is the start of a range. In a date picker, this is always false.
	 * @param date The date to check.
	 * @returns Always false.
	 * @internal
	 */
	isStartOfRange(_: T): boolean {
		return false;
	}

	/**
	 * Determine if a date is the end of a range. In a date picker, this is always false.
	 * @param date The date to check.
	 * @returns Always false.
	 * @internal
	 */
	isEndOfRange(_: T): boolean {
		return false;
	}

	/**
	 * Determine if a date is between the start and end dates. In a date picker, this is always false.
	 * @param date The date to check.
	 * @returns True if the date is between the start and end dates, false otherwise.
	 * @internal
	 */
	isBetweenRange(_: T): boolean {
		return false;
	}

	// /** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the injector */
	private readonly _injector = inject(Injector);

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** The minimum selectable dates.  */
	public readonly minSelection = input<number, NumberInput>(undefined, {
		transform: numberAttribute,
	});

	/** The maximum selectable dates.  */
	public readonly maxSelection = input<number, NumberInput>(undefined, {
		transform: numberAttribute,
	});

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T[]>();

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput | undefined>(undefined, {
		transform: (v: unknown) => (v === undefined || v === null ? undefined : (numberAttribute(v) as Weekday)),
	});

	protected readonly _weekStartsOn = computed(() => this.weekStartsOn() ?? this._i18n.config().firstDayOfWeek());

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** @internal Access the header */
	public readonly header = contentChild(BrnCalendarHeader);

	/** Store the cells */
	protected readonly _cells = contentChildren<BrnCalendarCellButton<T>>(BrnCalendarCellButton, {
		descendants: true,
	});

	/**
	 * The focused date.
	 */
	public readonly focusedDate = linkedSignal(() =>
		this.constrainDate(this.defaultFocusedDate() ?? this._dateAdapter.now()),
	);

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	public readonly days = computed(() => {
		const weekStartsOn = this._weekStartsOn();
		const month = this.focusedDate();
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
	});

	isSelected(date: T): boolean {
		return this.date()?.some((d) => this._dateAdapter.isSameDay(d, date)) ?? false;
	}

	selectDate(date: T): void {
		const selected = this.date() as T[] | undefined;
		if (this.isSelected(date)) {
			const minSelection = this.minSelection();
			if (selected?.length === minSelection) {
				// min selection reached, do not allow to deselect
				return;
			}

			this.date.set(selected?.filter((d) => !this._dateAdapter.isSameDay(d, date)));
		} else {
			const maxSelection = this.maxSelection();
			if (selected?.length === maxSelection) {
				// max selection reached, reset the selection to date
				this.date.set([date]);
			} else {
				// add the date to the selection
				this.date.set([...(selected ?? []), date]);
			}
		}
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

		this.focusedDate.set(date);

		// wait until the cells have all updated
		afterNextRender(
			{
				write: () => {
					// focus the cell with the target date.
					const cell = this._cells().find((c) => this._dateAdapter.isSameDay(c.date(), date));

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
}
