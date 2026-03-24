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
import type { BrnSelectItem } from './brn-select-item';

export interface BrnSelectBase<T> {
	disabledState: Signal<boolean>;
	itemToString: InputSignal<SelectItemToString<T> | undefined>;
	keyManager: ActiveDescendantKeyManager<BrnSelectItem<T>>;
	value: ModelSignal<T | null> | ModelSignal<T[] | null>;
	hasValue: Signal<boolean>;
	isExpanded: Signal<boolean>;
	triggerWidth: Signal<number | null>;

	isSelected: (itemValue: T) => boolean;
	select: (itemValue: T) => void;
	/** Select the active item with Enter key. */
	selectActiveItem: () => void;
	open: () => void;
}

export const BrnSelectBaseToken = new InjectionToken<BrnSelectBase<unknown>>('BrnSelectBaseToken');

export function provideBrnSelectBase<T>(instance: Type<BrnSelectBase<T>>): ExistingProvider {
	return { provide: BrnSelectBaseToken, useExisting: instance };
}

/**
 * Inject the select component.
 */
export function injectBrnSelectBase<T>(): BrnSelectBase<T> {
	return inject(BrnSelectBaseToken) as BrnSelectBase<T>;
}

export type SelectItemEqualToValue<T> = (itemValue: T, selectedValue: T | null) => boolean;
export type SelectItemToString<T> = (itemValue: T) => string;

export interface BrnSelectConfig<T> {
	isItemEqualToValue: SelectItemEqualToValue<T>;
	itemToString?: SelectItemToString<T>;
}

function getDefaultConfig<T>(): BrnSelectConfig<T> {
	return {
		isItemEqualToValue: (itemValue: T, selectedValue: T | null) => Object.is(itemValue, selectedValue),
		itemToString: undefined,
	};
}

const BrnSelectConfigToken = new InjectionToken<BrnSelectConfig<unknown>>('BrnSelectConfig');

export function provideBrnSelectConfig<T>(config: Partial<BrnSelectConfig<T>>): ValueProvider {
	return { provide: BrnSelectConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectBrnSelectConfig<T>(): BrnSelectConfig<T> {
	const injectedConfig = inject(BrnSelectConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as BrnSelectConfig<T>) : getDefaultConfig();
}
