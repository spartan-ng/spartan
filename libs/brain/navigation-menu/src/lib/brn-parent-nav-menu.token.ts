import { FactoryProvider, inject, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export interface BrnParentNavMenu {
	subNavVisible$: Subject<boolean>;
}

export const BrnParentNavMenu = new InjectionToken<BrnParentNavMenu>('ParentNavMenu');

export function injectBrnParentNavMenu(): BrnParentNavMenu | null {
	return inject(BrnParentNavMenu, { optional: true });
}

export function provideBrnParentNavMenu(parentNavMenu: () => BrnParentNavMenu): FactoryProvider {
	return { provide: BrnParentNavMenu, useFactory: parentNavMenu };
}
