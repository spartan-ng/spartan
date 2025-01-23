import { ExistingProvider, InjectionToken, Type } from '@angular/core';
import type { BrnCommandItemDirective } from './brn-command-item.directive';

export const BrnCommandItemToken = new InjectionToken<BrnCommandItemDirective>('BrnCommandItemToken');

export function provideBrnCommandItem(command: Type<BrnCommandItemDirective>): ExistingProvider {
	return { provide: BrnCommandItemToken, useExisting: command };
}
