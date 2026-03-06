import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnTimeInput } from './brn-time-input';

export const BrnTimeInputToken = new InjectionToken<BrnTimeInput>('BrnTimeInputToken');

export function injectBrnTimeInput(): BrnTimeInput {
	return inject(BrnTimeInputToken);
}

export function provideBrnTimeInput(timeInput: Type<BrnTimeInput>): ExistingProvider {
	return { provide: BrnTimeInputToken, useExisting: timeInput };
}
