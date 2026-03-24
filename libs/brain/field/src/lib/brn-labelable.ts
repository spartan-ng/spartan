import { type ExistingProvider, inject, InjectionToken, type Signal, type Type } from '@angular/core';

export interface BrnLabelable {
	labelableId: Signal<string | null | undefined>;
}

export const BrnLabelable = new InjectionToken<BrnLabelable>('BrnLabelable');

export function provideBrnLabelable(labelable: Type<BrnLabelable>): ExistingProvider {
	return { provide: BrnLabelable, useExisting: labelable };
}

export function injectBrnLabelable(): BrnLabelable | null {
	return inject(BrnLabelable, { optional: true });
}
