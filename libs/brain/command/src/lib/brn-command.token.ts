import { type ExistingProvider, inject, InjectionToken, type Type, type ValueProvider } from '@angular/core';
import type { BrnCommand } from './brn-command';

export const BrnCommandToken = new InjectionToken<BrnCommand>('BrnCommandToken');

export function provideBrnCommand(command: Type<BrnCommand>): ExistingProvider {
	return { provide: BrnCommandToken, useExisting: command };
}

export function injectBrnCommand(): BrnCommand {
	return inject(BrnCommandToken);
}

// config
export type CommandFilter = (value: string, search: string) => boolean;

export interface BrnCommandConfig {
	filter: CommandFilter;
}

const defaultConfig: BrnCommandConfig = {
	filter: (value: string, search: string) => value.toLowerCase().includes(search.toLowerCase()),
};

const BrnCommandConfigToken = new InjectionToken<BrnCommandConfig>('BrnCommandConfig');

export function provideBrnCommandConfig(config: Partial<BrnCommandConfig>): ValueProvider {
	return { provide: BrnCommandConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnCommandConfig(): BrnCommandConfig {
	return inject(BrnCommandConfigToken, { optional: true }) ?? defaultConfig;
}
