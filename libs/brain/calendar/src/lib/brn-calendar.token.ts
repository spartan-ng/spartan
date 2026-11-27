import { type ExistingProvider, inject, InjectionToken, type InputSignal, type Signal, type Type } from '@angular/core';
import type { BrnCalendarCellButton } from './brn-calendar-cell-button';
import type { BrnCalendarHeader } from './brn-calendar-header';

export interface BrnCalendarMonthData<T> {
	/** The first day of the displayed month. */
	month: T;
	/** The days to render for this month, including the leading and trailing days of the adjacent months. */
	days: T[];
}

export interface BrnCalendarBase<T> {
	isSelected: (date: T) => boolean;
	selectDate: (date: T) => void;

	constrainDate: (date: T) => T;
	isDateDisabled: (date: T) => boolean;
	setFocusedDate: (date: T) => void;

	isStartOfRange: (date: T) => boolean;
	isEndOfRange: (date: T) => boolean;
	isBetweenRange: (date: T) => boolean;

	min: Signal<T | undefined>;
	max: Signal<T | undefined>;
	disabled: Signal<boolean>;
	focusedDate: Signal<T>;
	header: Signal<BrnCalendarHeader | undefined>;
	days: Signal<T[]>;
	highlightDays: InputSignal<T[]>;

	/** The months to display. Only implemented by calendars that support rendering multiple months. */
	months?: Signal<BrnCalendarMonthData<T>[]>;
	/** Show the month of the given date at the given month offset. */
	showMonth?: (date: T, offset: number) => void;

	unregisterCalendarCell(cell: BrnCalendarCellButton<T>): void;
	registerCalendarCell(cell: BrnCalendarCellButton<T>): void;
}

export const BrnCalendarToken = new InjectionToken<BrnCalendarBase<unknown>>('BrnCalendarToken');

export function provideBrnCalendar<T>(instance: Type<BrnCalendarBase<T>>): ExistingProvider {
	return { provide: BrnCalendarToken, useExisting: instance };
}

/**
 * Inject the calendar component.
 */
export function injectBrnCalendar<T>(): BrnCalendarBase<T> {
	return inject(BrnCalendarToken) as BrnCalendarBase<T>;
}
