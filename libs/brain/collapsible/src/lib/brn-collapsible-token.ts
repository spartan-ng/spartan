import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnCollapsible } from './brn-collapsible';

export const BrnCollapsibleToken = new InjectionToken<BrnCollapsible>('BrnCollapsibleToken');

export function injectBrnCollapsible() {
	return inject(BrnCollapsibleToken, { optional: true });
}

export function provideBrnCollapsible(collapsible: Type<BrnCollapsible>): ExistingProvider {
	return { provide: BrnCollapsibleToken, useExisting: collapsible };
}
