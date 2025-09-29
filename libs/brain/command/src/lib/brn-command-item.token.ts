import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnCommandItem } from './brn-command-item';

export const BrnCommandItemToken = new InjectionToken<BrnCommandItem>('BrnCommandItemToken');

export function provideBrnCommandItem(command: Type<BrnCommandItem>): ExistingProvider {
	return { provide: BrnCommandItemToken, useExisting: command };
}
