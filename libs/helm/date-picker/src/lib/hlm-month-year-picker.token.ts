import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface HlmMonthYearPickerConfig<T> {
	/**
	 * If true, the date picker will close when a date is selected.
	 */
	autoCloseOnSelect: boolean;

	/**
	 * Defines how the date should be displayed in the UI.
	 *
	 * @param date
	 * @returns formatted date
	 */
	formatDate: (date: T) => string;

	/**
	 * Defines how the date should be displayed while the input is focused,
	 * i.e. the format the user is expected to type in.
	 *
	 * @param date
	 * @returns formatted date in the input/edit format
	 */
	formatInputDate: (date: T) => string;

	/**
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param date
	 * @returns transformed date
	 */
	transformDate: (date: T) => T;

	/**
	 * Parse a user-entered string into a date.
	 *
	 * @param value the raw string from the input
	 * @returns the parsed date, or `null` when the value can't be parsed
	 */
	parseDate: (value: string) => T | null;
}

const mmYYYY = <T>(date: T) => {
	if (!(date instanceof Date)) return `${date}`;

	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${month}/${year}`;
};

function getDefaultConfig<T>(): HlmMonthYearPickerConfig<T> {
	return {
		formatDate: mmYYYY,
		formatInputDate: mmYYYY,
		transformDate: (date) => date,
		parseDate: (value) => {
			if (typeof value !== 'string') return null;

			const match = value.match(/^(\d{2})\/(\d{4})$/);
			if (!match) return null;

			const month = Number(match[1]);
			const year = Number(match[2]);

			if (month < 1 || month > 12) return null;

			const date = new Date(year, month - 1, 1);

			return date as T;
		},
		autoCloseOnSelect: false,
	};
}

const HlmMonthYearPickerConfigToken = new InjectionToken<HlmMonthYearPickerConfig<unknown>>('HlmMonthYearPickerConfig');

export function provideHlmMonthYearPickerConfig<T>(config: Partial<HlmMonthYearPickerConfig<T>>): ValueProvider {
	return { provide: HlmMonthYearPickerConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmMonthYearPickerConfig<T>(): HlmMonthYearPickerConfig<T> {
	const injectedConfig = inject(HlmMonthYearPickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmMonthYearPickerConfig<T>) : getDefaultConfig();
}
