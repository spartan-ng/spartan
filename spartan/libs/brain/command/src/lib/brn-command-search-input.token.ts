import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnCommandSearchInput } from './brn-command-search-input';

export const BrnCommandSearchInputToken = new InjectionToken<BrnCommandSearchInput>('BrnCommandSearchInputToken');

export function provideBrnCommandSearchInput(command: Type<BrnCommandSearchInput>): ExistingProvider {
	return { provide: BrnCommandSearchInputToken, useExisting: command };
}
