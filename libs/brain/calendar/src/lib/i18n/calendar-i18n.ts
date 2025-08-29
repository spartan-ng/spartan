import { InjectionToken, ValueProvider, inject } from '@angular/core';

export interface BrnCalendarI18n {
	formatWeekdayName: (index: number) => string;
	formatHeader: (month: number, year: number) => string;
	labelPrevious: () => string;
	labelNext: () => string;
	labelWeekday: (index: number) => string;
	months: () => [string, string, string, string, string, string, string, string, string, string, string, string];
	years: (startYear: number, endYear: number) => number[];
}

export const BrnCalendarI18nToken = new InjectionToken<BrnCalendarI18n>('BrnCalendarI18nToken');

/**
 * Provide the calendar i18n configuration.
 */
export function provideBrnCalendarI18n(configuration: BrnCalendarI18n): ValueProvider {
	return { provide: BrnCalendarI18nToken, useValue: configuration };
}

const defaultCalendarI18n: BrnCalendarI18n = {
	formatWeekdayName: (index: number) => {
		const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		return weekdays[index];
	},
	months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	years: (startYear = 1925, endYear = 2025) => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
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
export function injectBrnCalendarI18n(): BrnCalendarI18n {
	return inject(BrnCalendarI18nToken, { optional: true }) ?? defaultCalendarI18n;
}
