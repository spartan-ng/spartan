import { type ExistingProvider, InjectionToken, type Type, inject } from '@angular/core';
import type { BrnProgress } from './brn-progress';

const BrnProgressToken = new InjectionToken<BrnProgress>('BrnProgressComponent');

export function provideBrnProgress(progress: Type<BrnProgress>): ExistingProvider {
	return { provide: BrnProgressToken, useExisting: progress };
}

export function injectBrnProgress(): BrnProgress {
	return inject(BrnProgressToken);
}
