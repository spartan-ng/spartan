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
} from '@angular/core';
import type { BrnAutocompleteItem } from './brn-autocomplete-item';

export interface BrnAutocompleteBase<T> {
	itemToString: InputSignal<AutocompleteItemToString<T> | undefined>;
	search: ModelSignal<string>;
	disabled: Signal<boolean>;
	disabledState: Signal<boolean>;
	keyManager: ActiveDescendantKeyManager<BrnAutocompleteItem<T>>;
	value: ModelSignal<T | null> | ModelSignal<string | null>;
	visibleItems: Signal<boolean>;
	isExpanded: Signal<boolean>;
	searchInputWrapperWidth: Signal<number | null>;
	errorState: Signal<boolean>;

	updateSearch: (value: string) => void;
	isSelected: (itemValue: T) => boolean;
	select: (itemValue: T) => void;
	open: () => void;
	resetValue: () => void;
	/** Select the active item with Enter key. */
	selectActiveItem: () => void;
}

export const BrnAutocompleteBaseToken = new InjectionToken<BrnAutocompleteBase<unknown>>('BrnAutocompleteBaseToken');

export function provideBrnAutocompleteBase<T>(autocomplete: Type<BrnAutocompleteBase<T>>): ExistingProvider {
	return { provide: BrnAutocompleteBaseToken, useExisting: autocomplete };
}

export function injectBrnAutocompleteBase<T>(): BrnAutocompleteBase<T> {
	return inject(BrnAutocompleteBaseToken) as BrnAutocompleteBase<T>;
}

// config
export type AutocompleteItemEqualToValue<T> = (itemValue: T, selectedValue: T | null) => boolean;
export type AutocompleteItemToString<T> = (itemValue: T) => string;

export interface BrnAutocompleteConfig<T> {
	isItemEqualToValue: AutocompleteItemEqualToValue<T>;
	itemToString?: AutocompleteItemToString<T>;
	autoHighlight: boolean;
}

function getDefaultConfig<T>(): BrnAutocompleteConfig<T> {
	return {
		isItemEqualToValue: (itemValue: T, selectedValue: T | null) => Object.is(itemValue, selectedValue),
		itemToString: undefined,
		autoHighlight: false,
	};
}

const BrnAutocompleteConfigToken = new InjectionToken<BrnAutocompleteConfig<unknown>>('BrnAutocompleteConfig');

export function provideBrnAutocompleteConfig<T>(config: Partial<BrnAutocompleteConfig<T>>): ValueProvider {
	return { provide: BrnAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectBrnAutocompleteConfig<T>(): BrnAutocompleteConfig<T> {
	const injectedConfig = inject(BrnAutocompleteConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as BrnAutocompleteConfig<T>) : getDefaultConfig();
}
