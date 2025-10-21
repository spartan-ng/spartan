import { ExistingProvider, InjectionToken, Type } from '@angular/core';

export const BrnNavigationMenuInteractable = new InjectionToken('BrnNavigationMenuInteractable');

export function provideBrnNavigationMenuInteractable<T>(interactable: Type<T>): ExistingProvider {
	return { provide: BrnNavigationMenuInteractable, useExisting: interactable };
}
