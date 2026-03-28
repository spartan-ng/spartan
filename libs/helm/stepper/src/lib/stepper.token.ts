import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import type { HlmStepperIndicatorMode } from './hlm-step-header';

export interface HlmStepperConfig {
	animationEnabled: boolean;
	animationDuration: number;
	defaultIndicatorMode: HlmStepperIndicatorMode;
}

const defaultConfig: HlmStepperConfig = {
	animationEnabled: true,
	animationDuration: 300,
	defaultIndicatorMode: 'state',
};

const HlmStepperConfigToken = new InjectionToken<HlmStepperConfig>('HlmStepperConfig');

function normalizeDuration(duration: number): number {
	if (!Number.isFinite(duration)) {
		return defaultConfig.animationDuration;
	}

	return Math.max(0, Math.round(duration));
}

export function provideHlmStepperConfig(config: Partial<HlmStepperConfig>): ValueProvider {
	const mergedConfig = { ...defaultConfig, ...config };
	return {
		provide: HlmStepperConfigToken,
		useValue: { ...mergedConfig, animationDuration: normalizeDuration(mergedConfig.animationDuration) },
	};
}

export function injectHlmStepperConfig(): HlmStepperConfig {
	const config = inject(HlmStepperConfigToken, { optional: true }) ?? defaultConfig;
	return { ...config, animationDuration: normalizeDuration(config.animationDuration) };
}
