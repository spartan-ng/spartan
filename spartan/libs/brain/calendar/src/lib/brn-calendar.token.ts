import {
	type ExistingProvider,
	InjectionToken,
	type Signal,
	type Type,
	type WritableSignal,
	inject,
} from '@angular/core';
import type { BrnCalendarHeader } from './brn-calendar-header';

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
	focusedDate: WritableSignal<T>;
	header: Signal<BrnCalendarHeader | undefined>;
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
