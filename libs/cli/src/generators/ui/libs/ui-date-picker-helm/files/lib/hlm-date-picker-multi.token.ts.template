import { inject, InjectionToken, ValueProvider } from '@angular/core';

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
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param dates
	 * @returns transformed date
	 */
	transformDates: (dates: T[]) => T[];
}

function getDefaultConfig<T>(): HlmDatePickerMultiConfig<T> {
	return {
		formatDates: (dates) => dates.map((date) => (date instanceof Date ? date.toDateString() : `${date}`)).join(', '),
		transformDates: (dates) => dates,
		autoCloseOnMaxSelection: false,
	};
}

const HlmDatePickerMultiConfigToken = new InjectionToken<HlmDatePickerMultiConfig<unknown>>('HlmDatePickerMultiConfig');

export function provideHlmDatePickerConfig<T>(config: Partial<HlmDatePickerMultiConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerMultiConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmDatePickerMultiConfig<T>(): HlmDatePickerMultiConfig<T> {
	const injectedConfig = inject(HlmDatePickerMultiConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerMultiConfig<T>) : getDefaultConfig();
}
