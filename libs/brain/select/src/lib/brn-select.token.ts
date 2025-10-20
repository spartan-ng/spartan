import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnSelect } from './brn-select';

const BrnSelectToken = new InjectionToken<BrnSelect>('BrnSelectToken');

export function injectBrnSelect<T>(): BrnSelect<T> {
	return inject(BrnSelectToken) as BrnSelect<T>;
}

export function provideBrnSelect(select: Type<BrnSelect>): ExistingProvider {
	return { provide: BrnSelectToken, useExisting: select };
}
