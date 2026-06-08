import {
	type ExistingProvider,
	inject,
	InjectionToken,
	type Signal,
	type Type,
	type ValueProvider,
} from '@angular/core';
import type { BrnPopover } from '@spartan-ng/brain/popover';

export interface HlmDatePickerBase<T> {
	popover: Signal<BrnPopover>;
	disabledState: Signal<boolean>;
	formattedDate: Signal<string | undefined>;
	hasDate: Signal<boolean>;
	/** Commit a date to the picker (e.g. from a parsed input). Pass `undefined` to clear. Optional. */
	updateDate?(value: T | undefined): void;
	// used for ControlValueAccessor
	touched?(): void;
}

export const HlmDatePickerToken = new InjectionToken<HlmDatePickerBase<unknown>>('HlmDatePickerToken');

export function provideHlmDatePicker(instance: Type<HlmDatePickerBase<unknown>>): ExistingProvider {
	return { provide: HlmDatePickerToken, useExisting: instance };
}

/**
 * Inject the date picker component.
 */
export function injectHlmDatePicker<T>(): HlmDatePickerBase<T> {
	return inject(HlmDatePickerToken) as HlmDatePickerBase<T>;
}

export interface HlmDatePickerConfig<T> {
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

	/**
	 * Parse a user-entered string into a date.
	 *
	 * @param value the raw string from the input
	 * @returns the parsed date, or `undefined` when the value can't be parsed
	 */
	parseDate: (value: string) => T | undefined;
}

function getDefaultConfig<T>(): HlmDatePickerConfig<T> {
	return {
		formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
		transformDate: (date) => date,
		parseDate: (value) => {
			const date = new Date(value);
			return isNaN(date.getTime()) ? undefined : (date as T);
		},
		autoCloseOnSelect: false,
	};
}

const HlmDatePickerConfigToken = new InjectionToken<HlmDatePickerConfig<unknown>>('HlmDatePickerConfig');

export function provideHlmDatePickerConfig<T>(config: Partial<HlmDatePickerConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmDatePickerConfig<T>(): HlmDatePickerConfig<T> {
	const injectedConfig = inject(HlmDatePickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerConfig<T>) : getDefaultConfig();
}
