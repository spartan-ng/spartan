import { inject, InjectionToken, ValueProvider } from '@angular/core';
import { Subject } from 'rxjs';

export interface BrnParentNavMenu {
	subNavHover$: Subject<boolean>;
}

export const BrnParentNavMenu = new InjectionToken<BrnParentNavMenu>('ParentNavMenu');

export function injectBrnParentNavMenu(): BrnParentNavMenu | null {
	return inject(BrnParentNavMenu, { optional: true });
}

export function provideBrnParentNavMenu(parentNavMenu: BrnParentNavMenu): ValueProvider {
	return { provide: BrnParentNavMenu, useValue: parentNavMenu };
}
