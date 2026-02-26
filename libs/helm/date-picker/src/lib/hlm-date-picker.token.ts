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
}

export const HlmDatePickerToken = new InjectionToken<HlmDatePickerBase<unknown>>('HlmDatePickerToken');

export function provideHlmDatePicker<T>(instance: Type<HlmDatePickerBase<T>>): ExistingProvider {
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
}

function getDefaultConfig<T>(): HlmDatePickerConfig<T> {
	return {
		formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
		transformDate: (date) => date,
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
