import {
	type ExistingProvider,
	inject,
	InjectionToken,
	type Signal,
	type Type,
	type WritableSignal,
} from '@angular/core';
import type { BrnYearMonthCalendarHeader } from './brn-year-month-calendar-header';

/** The available views of the month/year selector. */
export type BrnYearMonthCalendarView = 'year' | 'month';

/** A focusable cell (month or year button) registered with the month/year selector. */
export interface BrnYearMonthCalendarCell<T> {
	/** The date represented by the cell. */
	value: Signal<T>;
	/** Focus the cell. */
	focus(): void;
}

export interface BrnYearMonthCalendarBase<T> {
	/** The current view of the month/year selector. */
	view: WritableSignal<BrnYearMonthCalendarView>;
	/** The currently focused date. */
	focusedDate: WritableSignal<T>;
	/** Whether the month/year selector is disabled. */
	disabled: Signal<boolean>;
	/** The header directive, used to label the grid. */
	header: Signal<BrnYearMonthCalendarHeader | undefined>;

	/** The 12 months of the focused year. */
	months: Signal<T[]>;
	/** The years of the current page. */
	years: Signal<T[]>;
	/** The first and last year of the current page. */
	yearRange: Signal<{ start: number; end: number }>;

	/** Select a month, updating the value. */
	selectMonth: (date: T) => void;
	/** Select a year, moving to the month view. */
	selectYear: (date: T) => void;

	/** Whether the given month is selected. */
	isMonthSelected: (date: T) => boolean;
	/** Whether the given year is selected. */
	isYearSelected: (date: T) => boolean;
	/** Whether the given month is today's month. */
	isMonthToday: (date: T) => boolean;
	/** Whether the given year is the current year. */
	isYearToday: (date: T) => boolean;
	/** Whether the given month is disabled. */
	isMonthDisabled: (date: T) => boolean;
	/** Whether the given year is disabled. */
	isYearDisabled: (date: T) => boolean;

	/** Move focus to the given month, adjusting the year if needed. */
	setFocusedMonth: (date: T) => void;
	/** Move focus to the given year, paging if needed. */
	setFocusedYear: (date: T) => void;

	/** Navigate to the previous year or page of years. */
	goToPrevious: () => void;
	/** Navigate to the next year or page of years. */
	goToNext: () => void;
	/** Whether navigating to the previous page/year is disabled. */
	isPreviousDisabled: () => boolean;
	/** Whether navigating to the next page/year is disabled. */
	isNextDisabled: () => boolean;

	registerCell(cell: BrnYearMonthCalendarCell<T>): void;
	unregisterCell(cell: BrnYearMonthCalendarCell<T>): void;
}

export const BrnYearMonthCalendarToken = new InjectionToken<BrnYearMonthCalendarBase<unknown>>(
	'BrnYearMonthCalendarToken',
);

export function provideBrnYearMonthCalendar<T>(instance: Type<BrnYearMonthCalendarBase<T>>): ExistingProvider {
	return { provide: BrnYearMonthCalendarToken, useExisting: instance };
}

/**
 * Inject the month/year selector.
 */
export function injectBrnYearMonthCalendar<T>(): BrnYearMonthCalendarBase<T> {
	return inject(BrnYearMonthCalendarToken) as BrnYearMonthCalendarBase<T>;
}
