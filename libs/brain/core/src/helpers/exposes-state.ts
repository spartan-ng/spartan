import type { Signal } from '@angular/core';
import { createInjectionToken } from './create-injection-token';

export interface ExposesState {
	state: Signal<'open' | 'closed'>;
}

export const [
	injectExposesStateProvider,
	provideExposesStateProvider,
	provideExposesStateProviderExisting,
	EXPOSES_STATE_TOKEN,
] = createInjectionToken<ExposesState>('@spartan-ng EXPOSES_STATE_TOKEN');
