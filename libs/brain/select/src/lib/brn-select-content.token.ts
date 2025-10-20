import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnSelectContent } from './brn-select-content';

const BrnSelectContentToken = new InjectionToken<BrnSelectContent<unknown>>('BrnSelectContentToken');

export function injectBrnSelectContent<T>(): BrnSelectContent<T> {
	return inject(BrnSelectContentToken) as BrnSelectContent<T>;
}

export function provideBrnSelectContent(select: Type<BrnSelectContent<unknown>>): ExistingProvider {
	return { provide: BrnSelectContentToken, useExisting: select };
}
