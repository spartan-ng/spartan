import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';

export const BrnNavigationMenuItemToken = new InjectionToken<BrnNavigationMenuItem>('BrnNavigationMenuItemToken');

export function injectBrnNavigationMenuItem(): BrnNavigationMenuItem {
	return inject(BrnNavigationMenuItemToken);
}

export function provideBrnNavigationMenuItem(navigationMenuItem: Type<BrnNavigationMenuItem>): ExistingProvider {
	return { provide: BrnNavigationMenuItemToken, useExisting: navigationMenuItem };
}
