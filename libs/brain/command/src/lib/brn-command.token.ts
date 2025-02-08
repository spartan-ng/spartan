import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnCommandDirective } from './brn-command.directive';

export const BrnCommandToken = new InjectionToken<BrnCommandDirective>('BrnCommandToken');

export function provideBrnCommand(command: Type<BrnCommandDirective>): ExistingProvider {
	return { provide: BrnCommandToken, useExisting: command };
}

export function injectBrnCommand(): BrnCommandDirective {
	return inject(BrnCommandToken);
}
