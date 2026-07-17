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
import type { ControlState } from '@spartan-ng/brain/forms';
import type { BrnSelectItem } from './brn-select-item';
import type { BrnSelectTrigger } from './brn-select-trigger';

export interface BrnSelectBase<T> {
	disabledState: Signal<boolean>;
	itemToString: InputSignal<SelectItemToString<T> | undefined>;
	keyManager: ActiveDescendantKeyManager<BrnSelectItem<T>>;
	value: ModelSignal<T | undefined | null> | ModelSignal<T[] | undefined | null>;
	hasValue: Signal<boolean>;
	isExpanded: Signal<boolean>;
	triggerWidth: Signal<number | null>;
	controlState?: Signal<ControlState | null>;

	isSelected: (itemValue: T) => boolean;
	select: (itemValue: T) => void;
	/** Select the active item with Enter key. */
	selectActiveItem: () => void;
	open: () => void;
	close: () => void;
	toggle: () => void;
	registerSelectTrigger: (input: BrnSelectTrigger) => void;
	updateTriggerWidth: (width: number | null) => void;
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

export type SelectItemEqualToValue<T> = (itemValue: T, selectedValue: T | undefined | null) => boolean;
export type SelectItemToString<T> = (itemValue: T) => string;

export interface BrnSelectConfig<T> {
	isItemEqualToValue: SelectItemEqualToValue<T>;
	/**
	 * Determines whether a single value is present (i.e., has been selected).
	 * Considers `undefined`, `null`, and empty string as "not present".
	 * Only used by {@link BrnSelectComponent} (single select), ignored by the multiple select variant.
	 */
	isSingleValuePresent: (value: T | undefined | null) => boolean;
	itemToString?: SelectItemToString<T>;
}

function getDefaultConfig<T>(): BrnSelectConfig<T> {
	return {
		isItemEqualToValue: (itemValue: T, selectedValue: T | undefined | null) => Object.is(itemValue, selectedValue),
		isSingleValuePresent: (value: T | undefined | null) => value !== undefined && value !== null && value !== '',
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
