import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnSelectComponent } from './brn-select.component';

const BrnSelectToken = new InjectionToken<BrnSelectComponent>('BrnSelectToken');

export function injectBrnSelect<T>(): BrnSelectComponent<T> {
	return inject(BrnSelectToken) as BrnSelectComponent<T>;
}

export function provideBrnSelect(select: Type<BrnSelectComponent>): ExistingProvider {
	return { provide: BrnSelectToken, useExisting: select };
}
