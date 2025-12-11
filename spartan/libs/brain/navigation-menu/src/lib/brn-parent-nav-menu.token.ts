import { type FactoryProvider, inject, InjectionToken } from '@angular/core';
import type { Subject } from 'rxjs';

export interface BrnParentNavMenu {
	subNavVisible$: Subject<boolean>;
}

export const BrnParentNavMenu = new InjectionToken<BrnParentNavMenu>('BrnParentNavMenu');

export function injectBrnParentNavMenu(): BrnParentNavMenu | null {
	return inject(BrnParentNavMenu, { optional: true });
}

export function provideBrnParentNavMenu(parentNavMenu: () => BrnParentNavMenu): FactoryProvider {
	return { provide: BrnParentNavMenu, useFactory: parentNavMenu };
}
