import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnCommandInput } from './brn-command-input';

export const BrnCommandInputToken = new InjectionToken<BrnCommandInput>('BrnCommandInputToken');

export function provideBrnCommandInput(command: Type<BrnCommandInput>): ExistingProvider {
	return { provide: BrnCommandInputToken, useExisting: command };
}
