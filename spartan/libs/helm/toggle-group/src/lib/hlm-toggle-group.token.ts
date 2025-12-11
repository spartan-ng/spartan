import { type ExistingProvider, InjectionToken, type Type, inject } from '@angular/core';
import type { HlmToggleGroup } from './hlm-toggle-group';

export const HlmToggleGroupToken = new InjectionToken<HlmToggleGroup>('HlmToggleGroupToken');

export function injectHlmToggleGroup(): HlmToggleGroup {
	return inject(HlmToggleGroupToken);
}

export function provideHlmToggleGroup(toggleGroup: Type<HlmToggleGroup>): ExistingProvider {
	return { provide: HlmToggleGroupToken, useExisting: toggleGroup };
}
