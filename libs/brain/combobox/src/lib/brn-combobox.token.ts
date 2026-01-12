import type { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
	type ExistingProvider,
	inject,
	InjectionToken,
	type InputSignal,
	type ModelSignal,
	type Signal,
	type Type,
	type ValueProvider,
	type WritableSignal,
} from '@angular/core';
import { comboboxContainsFilter } from './brn-combobox-filter';
import type { BrnComboboxItem } from './brn-combobox-item';

export interface BrnComboboxBase<T> {
	filter: InputSignal<ComboboxFilter<T>>;
	itemToString: InputSignal<ComboboxItemToString<T> | undefined>;
	collator: Signal<Intl.Collator>;
	search: WritableSignal<string>;
	disabled: Signal<boolean>;
	disabledState: Signal<boolean>;
	keyManager: ActiveDescendantKeyManager<BrnComboboxItem<T>>;
	value: ModelSignal<T | null> | ModelSignal<T[] | null>;
	visibleItems: Signal<boolean>;
	isExpanded: Signal<boolean>;
	searchInputWrapperWidth: Signal<number | null>;

	isSelected: (itemValue: T) => boolean;
	select: (itemValue: T) => void;
	open: () => void;
	resetValue: () => void;
	/** Select the active item with Enter key. */
	selectActiveItem: () => void;
	/** Remove last selected item with Backspace key. Only works with multiple selection comboboxes. */
	removeLastSelectedItem: () => void;
	removeValue: (value: T) => void;
}

export const BrnComboboxBaseToken = new InjectionToken<BrnComboboxBase<unknown>>('BrnComboboxBaseToken');

export function provideBrnComboboxBase<T>(instance: Type<BrnComboboxBase<T>>): ExistingProvider {
	return { provide: BrnComboboxBaseToken, useExisting: instance };
}

/**
 * Inject the combobox component.
 */
export function injectBrnComboboxBase<T>(): BrnComboboxBase<T> {
	return inject(BrnComboboxBaseToken) as BrnComboboxBase<T>;
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
	itemValue: T,
	search: string,
	collator: Intl.Collator,
	itemToString?: ComboboxItemToString<T>,
) => boolean;

export type ComboboxItemEqualToValue<T> = (itemValue: T, selectedValue: T | null) => boolean;

export type ComboboxItemToString<T> = (itemValue: T) => string;

export interface BrnComboboxConfig<T> {
	filterOptions: ComboboxFilterOptions;
	filter: ComboboxFilter<T>;
	isItemEqualToValue: ComboboxItemEqualToValue<T>;
	itemToStringLabel?: ComboboxItemToString<T>;
}

function getDefaultConfig<T>(): BrnComboboxConfig<T> {
	return {
		filterOptions: {
			usage: 'search',
			sensitivity: 'base',
			ignorePunctuation: true,
		},
		filter: (itemValue: T, search: string, collator: Intl.Collator, itemToString?: ComboboxItemToString<T>) =>
			comboboxContainsFilter(itemValue, search, collator, itemToString),
		isItemEqualToValue: (itemValue: T, selectedValue: T | null) => itemValue === selectedValue,
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
