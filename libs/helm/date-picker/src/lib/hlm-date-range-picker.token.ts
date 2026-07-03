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
	formatDates: (dates: [T | undefined, T | undefined]) => string;

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
	 * @returns the parsed range, or `undefined` when the value can't be parsed
	 */
	parseDate: (value: string) => [T, T] | undefined;
}

function getDefaultConfig<T>(): HlmDateRangePickerConfig<T> {
	return {
		formatDates: (dates) =>
			dates
				.filter(Boolean)
				.map((date) => (date instanceof Date ? date.toDateString() : `${date}`))
				.join(' - '),
		transformDates: (dates) => dates,
		autoCloseOnEndSelection: false,
		parseDate: (value) => {
			if (typeof value !== 'string') return undefined;

			const parts = value.split(' - ').map((part) => part.trim());
			if (parts.length !== 2) return undefined;

			const start = new Date(parts[0]);
			const end = new Date(parts[1]);

			if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;

			return [start, end] as [T, T];
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
