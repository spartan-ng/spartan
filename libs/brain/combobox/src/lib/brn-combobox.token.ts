import { ExistingProvider, inject, InjectionToken, Type, ValueProvider } from '@angular/core';
import type { BrnCombobox } from './brn-combobox';
import { comboboxContainsFilter } from './brn-combobox-filter';

export const BrnComboboxToken = new InjectionToken<BrnCombobox<unknown>>('BrnComboboxToken');

export function provideBrnCombobox<T>(combobox: Type<BrnCombobox<T>>): ExistingProvider {
	return { provide: BrnComboboxToken, useExisting: combobox };
}

export function injectBrnCombobox<T>(): BrnCombobox<T> {
	return inject(BrnComboboxToken) as BrnCombobox<T>;
}

// config
export interface ComboboxFilterOptions extends Intl.CollatorOptions {
	/**
	 * The locale to use for string comparison.
	 * Defaults to the user's runtime locale.
	 */
	locale?: Intl.LocalesArgument;
}

export type ComboboxFilter<T> = (
	value: T,
	search: string,
	collator: Intl.Collator,
	itemToString?: ComboboxItemToString<T>,
) => boolean;

export type ComboboxItemToString<T> = (value: T) => string;

export interface BrnComboboxConfig<T> {
	filterOptions: ComboboxFilterOptions;
	filter: ComboboxFilter<T>;
	itemToStringLabel?: ComboboxItemToString<T>;
}

function getDefaultConfig<T>(): BrnComboboxConfig<T> {
	return {
		filterOptions: {
			usage: 'search',
			sensitivity: 'base',
			ignorePunctuation: true,
		},
		filter: (value: T, search: string, collator: Intl.Collator, itemToString?: ComboboxItemToString<T>) =>
			comboboxContainsFilter(value, search, collator, itemToString),
		itemToStringLabel: undefined,
	};
}

const BrnComboboxConfigToken = new InjectionToken<BrnComboboxConfig<unknown>>('BrnComboboxConfig');

export function provideBrnComboboxConfig<T>(config: Partial<BrnComboboxConfig<T>>): ValueProvider {
	return { provide: BrnComboboxConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectBrnComboboxConfig<T>(): BrnComboboxConfig<T> {
	const injectedConfig = inject(BrnComboboxConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as BrnComboboxConfig<T>) : getDefaultConfig();
}
