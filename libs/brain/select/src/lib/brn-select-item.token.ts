import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnSelectItem } from './brn-select-item';

export const BrnSelectItemToken = new InjectionToken<BrnSelectItem<unknown>>('BrnSelectItemToken');

export function provideBrnSelectItem<T>(selectItem: Type<BrnSelectItem<T>>): ExistingProvider {
	return { provide: BrnSelectItemToken, useExisting: selectItem };
}
