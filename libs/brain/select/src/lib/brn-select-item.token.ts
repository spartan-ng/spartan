import type { Highlightable } from '@angular/cdk/a11y';
import { type ExistingProvider, InjectionToken, type Signal, type Type } from '@angular/core';

/**
 * The contract for any option rendered inside the select listbox — the extension point
 * for custom rows via `provideBrnSelectItem`. Implemented by `BrnSelectItem` and `BrnSelectAll`.
 */
export interface BrnSelectOption<T> extends Highlightable {
	readonly id: Signal<string>;
	readonly disabled: boolean;
	/** The value the option represents. `undefined` for non-value rows such as the select-all row. */
	readonly value: Signal<T | undefined>;
	/** The label used for typeahead. */
	getLabel(): string;
	/** Commit this option (mouse click / Enter key). */
	select(): void;
}

export const BrnSelectItemToken = new InjectionToken<BrnSelectOption<unknown>>('BrnSelectItemToken');

export function provideBrnSelectItem<T>(selectItem: Type<BrnSelectOption<T>>): ExistingProvider {
	return { provide: BrnSelectItemToken, useExisting: selectItem };
}
