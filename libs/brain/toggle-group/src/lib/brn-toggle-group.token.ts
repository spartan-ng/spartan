import { ExistingProvider, InjectionToken, Type, inject } from '@angular/core';
import type { BrnToggleGroupComponent } from './brn-toggle-group.component';

const BrnToggleGroupToken = new InjectionToken<BrnToggleGroupComponent>('BrnToggleGroupToken');

export function injectBrnToggleGroup<T>(): BrnToggleGroupComponent<T> | null {
	return inject(BrnToggleGroupToken, { optional: true }) as BrnToggleGroupComponent<T> | null;
}

export function provideBrnToggleGroup<T>(value: Type<BrnToggleGroupComponent<T>>): ExistingProvider {
	return { provide: BrnToggleGroupToken, useExisting: value };
}
