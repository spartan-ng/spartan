import { ExistingProvider, InjectionToken, Type } from '@angular/core';
import type { BrnCommandSearchInputDirective } from './brn-command-search-input.directive';

export const BrnCommandSearchInputToken = new InjectionToken<BrnCommandSearchInputDirective>(
	'BrnCommandSearchInputToken',
);

export function provideBrnCommandSearchInput(command: Type<BrnCommandSearchInputDirective>): ExistingProvider {
	return { provide: BrnCommandSearchInputToken, useExisting: command };
}
