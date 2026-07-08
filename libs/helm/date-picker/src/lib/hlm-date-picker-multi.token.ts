import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface HlmDatePickerMultiConfig<T> {
	/**
	 * If true, the date picker will close when the max selection of dates is reached.
	 */
	autoCloseOnMaxSelection: boolean;

	/**
	 * Defines how the date should be displayed in the UI.
	 *
	 * @param dates
	 * @returns formatted date
	 */
	formatDates: (dates: T[]) => string;

	/**
	 * Defines how the dates should be displayed while the input is focused,
	 * i.e. the format the user is expected to type in.
	 *
	 * @param dates
	 * @returns formatted dates in the input/edit format
	 */
	formatInputDates: (dates: T[]) => string;

	/**
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param dates
	 * @returns transformed date
	 */
	transformDates: (dates: T[]) => T[];

	/**
	 * Parse a user-entered string into a date.
	 *
	 * @param value the raw string from the input
	 * @returns the parsed date, or `null` when the value can't be parsed
	 */
	parseDate: (value: string) => T[] | null;
}

function getDefaultConfig<T>(): HlmDatePickerMultiConfig<T> {
	return {
		formatDates: (dates) => dates.map((date) => (date instanceof Date ? date.toDateString() : `${date}`)).join(', '),
		formatInputDates: (dates) =>
			dates
				.map((date) => {
					if (!(date instanceof Date)) return `${date}`;

					const day = String(date.getDate()).padStart(2, '0');
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const year = date.getFullYear();

					return `${day}/${month}/${year}`;
				})
				.join(', '),
		transformDates: (dates) => dates,
		autoCloseOnMaxSelection: false,
		parseDate: (value) => {
			if (typeof value !== 'string') return null;

			const parts = value.split(',').map((v) => v.trim());
			const result: Date[] = [];

			for (const part of parts) {
				const match = part.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
				if (!match) return null;

				const day = Number(match[1]);
				const month = Number(match[2]);
				const year = Number(match[3]);

				if (month < 1 || month > 12) return null;
				if (day < 1 || day > 31) return null;

				const date = new Date(year, month - 1, day);

				if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
					return null;
				}

				result.push(date);
			}

			return result as T[];
		},
	};
}

const HlmDatePickerMultiConfigToken = new InjectionToken<HlmDatePickerMultiConfig<unknown>>('HlmDatePickerMultiConfig');

export function provideHlmDatePickerMultiConfig<T>(config: Partial<HlmDatePickerMultiConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerMultiConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmDatePickerMultiConfig<T>(): HlmDatePickerMultiConfig<T> {
	const injectedConfig = inject(HlmDatePickerMultiConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerMultiConfig<T>) : getDefaultConfig();
}
