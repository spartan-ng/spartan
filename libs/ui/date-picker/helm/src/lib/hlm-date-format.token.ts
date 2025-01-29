import { inject, InjectionToken, ValueProvider } from '@angular/core';

export interface HlmDatePickerConfig<T> {
	/**
	 * Defines how the date should be displayed in the UI.
	 *
	 * @param date
	 * @returns formatted date
	 */
	formatDate: (date: T) => string;
}

const defaultConfig: HlmDatePickerConfig<Date> = {
	formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
};

const HlmDatePickerConfigToken = new InjectionToken<HlmDatePickerConfig<unknown>>('HlmDatePickerConfig');

export function provideHlmDatePickerConfig<T>(config?: HlmDatePickerConfig<T>): ValueProvider {
	return { provide: HlmDatePickerConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmDatePickerConfig<T>(): HlmDatePickerConfig<T> {
	return inject(HlmDatePickerConfigToken, { optional: true }) ?? (defaultConfig as HlmDatePickerConfig<T>);
}
