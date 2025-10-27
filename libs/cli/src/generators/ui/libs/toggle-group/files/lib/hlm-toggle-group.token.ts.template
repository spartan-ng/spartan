import { type ExistingProvider, InjectionToken, type Type, inject } from '@angular/core';
import type { HlmToggleGroup } from './hlm-toggle-group';

const HlmToggleGroupToken = new InjectionToken<HlmToggleGroup>('HlmToggleGroupToken');

export function provideHlmToggleGroup(config: Type<HlmToggleGroup>): ExistingProvider {
	return { provide: HlmToggleGroupToken, useExisting: config };
}

export function injectHlmToggleGroup(): HlmToggleGroup {
	return inject(HlmToggleGroupToken, { optional: true }) as HlmToggleGroup;
}
