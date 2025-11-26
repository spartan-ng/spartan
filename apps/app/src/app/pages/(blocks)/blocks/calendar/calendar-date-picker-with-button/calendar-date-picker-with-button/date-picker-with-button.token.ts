import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface DatePickerWithButtonConfig<T> {
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
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param date
	 * @returns transformed date
	 */
	transformDate: (date: T) => T;
}

function getDefaultConfig<T>(): DatePickerWithButtonConfig<T> {
	return {
		formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
		transformDate: (date) => date,
		autoCloseOnSelect: false,
	};
}

const DatePickerWithButtonConfigToken = new InjectionToken<DatePickerWithButtonConfig<unknown>>(
	'DatePickerWithButtonConfig',
);

export function provideDatePickerWithButtonConfig<T>(config: Partial<DatePickerWithButtonConfig<T>>): ValueProvider {
	return { provide: DatePickerWithButtonConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectDatePickerWithButtonConfig<T>(): DatePickerWithButtonConfig<T> {
	const injectedConfig = inject(DatePickerWithButtonConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as DatePickerWithButtonConfig<T>) : getDefaultConfig();
}
