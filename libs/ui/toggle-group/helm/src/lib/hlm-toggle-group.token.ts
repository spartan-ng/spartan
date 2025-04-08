import { ExistingProvider, InjectionToken, Type, inject } from '@angular/core';
import type { HlmToggleGroupDirective } from './hlm-toggle-group.directive';

const HlmToggleGroupToken = new InjectionToken<HlmToggleGroupDirective>('HlmToggleGroupToken');

export function provideHlmToggleGroup(config: Type<HlmToggleGroupDirective>): ExistingProvider {
	return { provide: HlmToggleGroupToken, useExisting: config };
}

export function injectHlmToggleGroup(): HlmToggleGroupDirective {
	return inject(HlmToggleGroupToken, { optional: true }) as HlmToggleGroupDirective;
}
