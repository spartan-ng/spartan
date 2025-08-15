import { ExistingProvider, InjectionToken, Signal, Type, WritableSignal, inject } from '@angular/core';
import { BrnCalendarHeader } from './brn-calendar-header';

export interface BrnCalendarBase<T> {
	isSelected: (date: T) => boolean;
	selectDate: (date: T) => void;

	constrainDate: (date: T) => T;
	isDateDisabled: (date: T) => boolean;
	setFocusedDate: (date: T) => void;

	isStartOfRange: (date: T) => boolean;
	isEndOfRange: (date: T) => boolean;
	isBetweenRange: (date: T) => boolean;

	disabled: Signal<boolean>;
	focusedDate: Signal<T>;
	header: Signal<BrnCalendarHeader | undefined>;
	state: Signal<{
		focusedDate: WritableSignal<T>;
	}>;
	days: Signal<T[]>;
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
