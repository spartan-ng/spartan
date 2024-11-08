import { InjectionToken, ValueProvider, inject } from '@angular/core';

export interface BrnCalendarI18n {
	formatWeekdayName: (index: number) => string;
	formatHeader: (month: number, year: number) => string;
	labelPrevious: () => string;
	labelNext: () => string;
	labelWeekday: (index: number) => string;
}

export const BrnCalendarI18nToken = new InjectionToken<BrnCalendarI18n>('BrnCalendarI18nToken');

/**
 * Provide the calendar i18n configuration.
 */
export function provideCalendarI18n(configuration: BrnCalendarI18n): ValueProvider {
	return { provide: BrnCalendarI18nToken, useValue: configuration };
}

const defaultCalendarI18n: BrnCalendarI18n = {
	formatWeekdayName: (index: number) => {
		const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		return weekdays[index];
	},
	formatHeader: (month: number, year: number) => {
		return new Date(year, month).toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric',
		});
	},
	labelPrevious: () => 'Go to the previous month',
	labelNext: () => 'Go to the next month',
	labelWeekday: (index: number) => {
		const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return weekdays[index];
	},
};

/**
 * Inject the calendar i18n configuration.
 */
export function injectCalendarI18n(): BrnCalendarI18n {
	return inject(BrnCalendarI18nToken, { optional: true }) ?? defaultCalendarI18n;
}
