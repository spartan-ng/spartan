import { inject, InjectionToken, type ExistingProvider, type Type } from '@angular/core';
import type { HlmReasoning } from './hlm-reasoning';

export const HlmReasoningToken = new InjectionToken<HlmReasoning>('HlmReasoningToken');

export function injectHlmReasoning() {
	return inject(HlmReasoningToken, { optional: true });
}

export function provideHlmReasoning(reasoning: Type<HlmReasoning>): ExistingProvider {
	return { provide: HlmReasoningToken, useExisting: reasoning };
}
