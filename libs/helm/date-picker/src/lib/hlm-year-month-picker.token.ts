import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface HlmYearMonthPickerConfig<T> {
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
	 * @returns the parsed date, or `undefined` when the value can't be parsed
	 */
	parseDate: (value: string) => T | undefined;
}

function getDefaultConfig<T>(): HlmYearMonthPickerConfig<T> {
	return {
		formatDate: (date) => {
			if (!(date instanceof Date)) return `${date}`;

			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();

			return `${month}/${year}`;
		},
		formatInputDate: (date) => {
			if (!(date instanceof Date)) return `${date}`;

			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();

			return `${month}/${year}`;
		},
		transformDate: (date) => date,
		parseDate: (value) => {
			if (typeof value !== 'string') return undefined;

			const match = value.match(/^(\d{2})\/(\d{4})$/);
			if (!match) return undefined;

			const month = Number(match[1]);
			const year = Number(match[2]);

			if (month < 1 || month > 12) return undefined;

			const date = new Date(year, month - 1, 1);

			return date as T;
		},
		autoCloseOnSelect: false,
	};
}

const HlmYearMonthPickerConfigToken = new InjectionToken<HlmYearMonthPickerConfig<unknown>>('HlmYearMonthPickerConfig');

export function provideHlmYearMonthPickerConfig<T>(config: Partial<HlmYearMonthPickerConfig<T>>): ValueProvider {
	return { provide: HlmYearMonthPickerConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmYearMonthPickerConfig<T>(): HlmYearMonthPickerConfig<T> {
	const injectedConfig = inject(HlmYearMonthPickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmYearMonthPickerConfig<T>) : getDefaultConfig();
}
