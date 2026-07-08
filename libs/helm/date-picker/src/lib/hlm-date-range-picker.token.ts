import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface HlmDateRangePickerConfig<T> {
	/**
	 * If true, the date picker will close when the max selection of dates is reached.
	 */
	autoCloseOnEndSelection: boolean;

	/**
	 * Defines how the date should be displayed in the UI.
	 *
	 * @param dates
	 * @returns formatted date
	 */
	formatDates: (dates: [T | null, T | null]) => string;

	/**
	 * Defines how the range should be displayed while the input is focused,
	 * i.e. the format the user is expected to type in.
	 *
	 * @param dates
	 * @returns formatted range in the input/edit format
	 */
	formatInputDates: (dates: [T | null, T | null]) => string;

	/**
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param dates
	 * @returns transformed date
	 */
	transformDates: (dates: [T, T]) => [T, T];

	/**
	 * Parse a user-entered string into a date range.
	 *
	 * @param value the raw string from the input
	 * @returns the parsed range, or `null` when the value can't be parsed
	 */
	parseDate: (value: string) => [T, T] | null;
}

function getDefaultConfig<T>(): HlmDateRangePickerConfig<T> {
	return {
		formatDates: (dates) =>
			dates
				.filter(Boolean)
				.map((date) => (date instanceof Date ? date.toDateString() : `${date}`))
				.join(' - '),
		formatInputDates: (dates) =>
			dates
				.filter(Boolean)
				.map((date) => (date instanceof Date ? date.toDateString() : `${date}`))
				.join(' - '),
		transformDates: (dates) => dates,
		autoCloseOnEndSelection: false,
		parseDate: (value) => {
			if (typeof value !== 'string') return null;

			const parts = value.split(' - ').map((part) => part.trim());
			if (parts.length === 0 || parts.length > 2) return null;

			const start = new Date(parts[0]);
			if (isNaN(start.getTime())) return null;

			const end = parts.length === 2 ? new Date(parts[1]) : start;

			return [start, isNaN(end.getTime()) ? start : end] as [T, T];
		},
	};
}

const HlmDateRangePickerConfigToken = new InjectionToken<HlmDateRangePickerConfig<unknown>>('HlmDateRangePickerConfig');

export function provideHlmDateRangePickerConfig<T>(config: Partial<HlmDateRangePickerConfig<T>>): ValueProvider {
	return { provide: HlmDateRangePickerConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmDateRangePickerConfig<T>(): HlmDateRangePickerConfig<T> {
	const injectedConfig = inject(HlmDateRangePickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDateRangePickerConfig<T>) : getDefaultConfig();
}
