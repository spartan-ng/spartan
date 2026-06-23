import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import type { SpartanStepperIndicatorMode } from './spartan-step-header';

export interface SpartanStepperConfig {
	animationEnabled: boolean;
	animationDuration: number;
	defaultIndicatorMode: SpartanStepperIndicatorMode;
}

const defaultConfig: SpartanStepperConfig = {
	animationEnabled: true,
	animationDuration: 300,
	defaultIndicatorMode: 'state',
};

const SpartanStepperConfigToken = new InjectionToken<SpartanStepperConfig>('spartanStepperConfig');

function normalizeDuration(duration: number): number {
	if (!Number.isFinite(duration)) {
		return defaultConfig.animationDuration;
	}

	return Math.max(0, Math.round(duration));
}

export function provideSpartanStepperConfig(config: Partial<SpartanStepperConfig>): ValueProvider {
	const mergedConfig = { ...defaultConfig, ...config };
	return {
		provide: SpartanStepperConfigToken,
		useValue: { ...mergedConfig, animationDuration: normalizeDuration(mergedConfig.animationDuration) },
	};
}

export function injectSpartanStepperConfig(): SpartanStepperConfig {
	const config = inject(SpartanStepperConfigToken, { optional: true }) ?? defaultConfig;
	return { ...config, animationDuration: normalizeDuration(config.animationDuration) };
}
