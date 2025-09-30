import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnRadioGroup } from './brn-radio-group';

const BrnRadioGroupToken = new InjectionToken<BrnRadioGroup<unknown>>('BrnRadioGroupToken');

export function provideBrnRadioGroupToken<T>(directive: Type<BrnRadioGroup<T>>): ExistingProvider {
	return { provide: BrnRadioGroupToken, useExisting: directive };
}

export function injectBrnRadioGroup<T = unknown>(): BrnRadioGroup<T> {
	return inject(BrnRadioGroupToken) as BrnRadioGroup<T>;
}
