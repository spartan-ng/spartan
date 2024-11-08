import { ExistingProvider, InjectionToken, Type, inject } from '@angular/core';
import type { BrnCalendarDirective } from './brn-calendar.directive';

export const BrnCalendarToken = new InjectionToken<BrnCalendarDirective<unknown>>('BrnCalendarToken');

export function provideCalendar<T>(instance: Type<BrnCalendarDirective<T>>): ExistingProvider {
	return { provide: BrnCalendarToken, useExisting: instance };
}

/**
 * Inject the calendar component.
 */
export function injectCalendar<T>(): BrnCalendarDirective<T> {
	return inject(BrnCalendarToken) as BrnCalendarDirective<T>;
}
