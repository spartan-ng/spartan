import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import { BrnNavigationMenu } from './brn-navigation-menu';

export const BrnNavigationMenuToken = new InjectionToken<BrnNavigationMenu>('BrnNavigationMenuToken');

export function injectBrnNavigationMenu(): BrnNavigationMenu {
	return inject(BrnNavigationMenuToken);
}

export function provideBrnNavigationMenu(navigationMenu: Type<BrnNavigationMenu>): ExistingProvider {
	return { provide: BrnNavigationMenuToken, useExisting: navigationMenu };
}
