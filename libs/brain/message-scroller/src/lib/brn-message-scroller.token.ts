import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnMessageScroller } from './brn-message-scroller';

export const BrnMessageScrollerToken = new InjectionToken<BrnMessageScroller>('BrnMessageScrollerToken');

export function injectBrnMessageScroller() {
	return inject(BrnMessageScrollerToken);
}

export function provideBrnMessageScroller(scroller: Type<BrnMessageScroller>): ExistingProvider {
	return { provide: BrnMessageScrollerToken, useExisting: scroller };
}
