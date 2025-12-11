import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnNavigationMenu } from './brn-navigation-menu';

export const BrnNavigationMenuToken = new InjectionToken<BrnNavigationMenu>('BrnNavigationMenuToken');

export function injectBrnNavigationMenu(): BrnNavigationMenu {
	return inject(BrnNavigationMenuToken);
}

export function provideBrnNavigationMenu(navigationMenu: Type<BrnNavigationMenu>): ExistingProvider {
	return { provide: BrnNavigationMenuToken, useExisting: navigationMenu };
}
