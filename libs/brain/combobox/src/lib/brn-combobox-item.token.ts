import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnComboboxItem } from './brn-combobox-item';

export const BrnComboboxItemToken = new InjectionToken<BrnComboboxItem<unknown>>('BrnComboboxItemToken');

export function provideBrnComboboxItem<T>(comboboxItem: Type<BrnComboboxItem<T>>): ExistingProvider {
	return { provide: BrnComboboxItemToken, useExisting: comboboxItem };
}
