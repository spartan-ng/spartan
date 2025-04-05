import { ExistingProvider, InjectionToken, Signal, Type, WritableSignal, inject } from '@angular/core';
import { BrnCalendarHeaderDirective } from './brn-calendar-header.directive';

export interface BrnCalendar<T> {
	isSelected: (date: T) => boolean;
	selectDate: (date: T) => void;

	constrainDate: (date: T) => T;
	isDateDisabled: (date: T) => boolean;
	setFocusedDate: (date: T) => void;

	disabled: Signal<boolean>;
	focusedDate: Signal<T>;
	header: Signal<BrnCalendarHeaderDirective | undefined>;
	state: Signal<{
		focusedDate: WritableSignal<T>;
	}>;
	days: Signal<T[]>;
}

export const BrnCalendarToken = new InjectionToken<BrnCalendar<unknown>>('BrnCalendarToken');

export function provideBrnCalendar<T>(instance: Type<BrnCalendar<T>>): ExistingProvider {
	return { provide: BrnCalendarToken, useExisting: instance };
}

/**
 * Inject the calendar component.
 */
export function injectBrnCalendar<T>(): BrnCalendar<T> {
	return inject(BrnCalendarToken) as BrnCalendar<T>;
}
