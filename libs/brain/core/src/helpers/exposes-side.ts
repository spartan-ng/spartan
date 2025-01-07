import type { Signal } from '@angular/core';
import { createInjectionToken } from './create-injection-token';

export interface ExposesSide {
	side: Signal<'top' | 'bottom' | 'left' | 'right'>;
}

export const [
	injectExposedSideProvider,
	provideExposedSideProvider,
	provideExposedSideProviderExisting,
	EXPOSES_SIDE_TOKEN,
] = createInjectionToken<ExposesSide>('@spartan-ng EXPOSES_SIDE_TOKEN');
