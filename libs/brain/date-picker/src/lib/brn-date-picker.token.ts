import { type ExistingProvider, inject, InjectionToken, type Signal, type Type } from '@angular/core';
import type { BrnPopover } from '@spartan-ng/brain/popover';

export interface BrnDatePickerBase<T> {
	popover: Signal<BrnPopover>;
	disabledState: Signal<boolean>;
	formattedDate: Signal<string | undefined>;
	hasDate: Signal<boolean>;
	/** The current raw value. Used by inputs to reformat into the input format on focus. Optional. */
	value?: Signal<T | undefined>;
	/** Commit a date to the picker (e.g. from a parsed input). Pass `undefined` to clear. Optional. */
	updateDate?(value: T | undefined): void;
	// used for ControlValueAccessor
	touched?(): void;
}

export const BrnDatePickerToken = new InjectionToken<BrnDatePickerBase<unknown>>('BrnDatePickerToken');

export function provideBrnDatePicker(instance: Type<BrnDatePickerBase<unknown>>): ExistingProvider {
	return { provide: BrnDatePickerToken, useExisting: instance };
}

/**
 * Inject the date picker component.
 */
export function injectBrnDatePicker<T>(): BrnDatePickerBase<T> {
	return inject(BrnDatePickerToken) as BrnDatePickerBase<T>;
}
