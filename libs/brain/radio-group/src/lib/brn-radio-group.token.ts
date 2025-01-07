import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnRadioGroupDirective } from './brn-radio-group.directive';

const BrnRadioGroupToken = new InjectionToken<BrnRadioGroupDirective<unknown>>('BrnRadioGroupToken');

export function provideBrnRadioGroupToken<T>(directive: Type<BrnRadioGroupDirective<T>>): ExistingProvider {
	return { provide: BrnRadioGroupToken, useExisting: directive };
}

export function injectBrnRadioGroup<T = unknown>(): BrnRadioGroupDirective<T> {
	return inject(BrnRadioGroupToken) as BrnRadioGroupDirective<T>;
}
