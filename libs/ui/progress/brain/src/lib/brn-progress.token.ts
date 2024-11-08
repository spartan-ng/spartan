import { ExistingProvider, InjectionToken, Type, inject } from '@angular/core';
import type { BrnProgressComponent } from './brn-progress.component';

const BrnProgressToken = new InjectionToken<BrnProgressComponent>('BrnProgressComponent');

export function provideBrnProgress(progress: Type<BrnProgressComponent>): ExistingProvider {
	return { provide: BrnProgressToken, useExisting: progress };
}

export function injectBrnProgress(): BrnProgressComponent {
	return inject(BrnProgressToken);
}
