import { InjectionToken, inject, type ExistingProvider, type Type } from '@angular/core';

export interface BrnPaginationSizeSource {
	itemsPerPage(): number;
}

export const BrnPaginationSizeSourceToken = new InjectionToken<BrnPaginationSizeSource>('BrnPaginationSizeSourceToken');

/** Registers `host` as the source consumed by `BrnPaginationSize`. */
export function provideBrnPaginationSizeSource(host: Type<BrnPaginationSizeSource>): ExistingProvider {
	return { provide: BrnPaginationSizeSourceToken, useExisting: host };
}

/** Injects the closest registered `BrnPaginationSizeSource`. */
export function injectBrnPaginationSizeSource(): BrnPaginationSizeSource {
	return inject(BrnPaginationSizeSourceToken);
}
