import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnCommand } from './brn-command';

export const BrnCommandToken = new InjectionToken<BrnCommand>('BrnCommandToken');

export function provideBrnCommand(command: Type<BrnCommand>): ExistingProvider {
	return { provide: BrnCommandToken, useExisting: command };
}

export function injectBrnCommand(): BrnCommand {
	return inject(BrnCommandToken);
}
