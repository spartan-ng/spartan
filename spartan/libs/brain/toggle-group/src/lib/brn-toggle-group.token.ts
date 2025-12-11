import { type ExistingProvider, InjectionToken, type Type, inject } from '@angular/core';
import type { BrnToggleGroup } from './brn-toggle-group';

const BrnToggleGroupToken = new InjectionToken<BrnToggleGroup>('BrnToggleGroupToken');

export function injectBrnToggleGroup<T>(): BrnToggleGroup<T> | null {
	return inject(BrnToggleGroupToken, { optional: true }) as BrnToggleGroup<T> | null;
}

export function provideBrnToggleGroup<T>(value: Type<BrnToggleGroup<T>>): ExistingProvider {
	return { provide: BrnToggleGroupToken, useExisting: value };
}
