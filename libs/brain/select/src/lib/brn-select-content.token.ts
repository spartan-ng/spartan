import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnSelectContentComponent } from './brn-select-content.component';

const BrnSelectContentToken = new InjectionToken<BrnSelectContentComponent<unknown>>('BrnSelectContentToken');

export function injectBrnSelectContent<T>(): BrnSelectContentComponent<T> {
	return inject(BrnSelectContentToken) as BrnSelectContentComponent<T>;
}

export function provideBrnSelectContent(select: Type<BrnSelectContentComponent<unknown>>): ExistingProvider {
	return { provide: BrnSelectContentToken, useExisting: select };
}
