import type { FocusableOption } from '@angular/cdk/a11y';
import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';

export const BrnNavigationMenuFocusable = new InjectionToken<FocusableOption>('BrnNavigationMenuFocusable');

export function provideBrnNavigationMenuFocusable<T extends FocusableOption>(focusable: Type<T>): ExistingProvider {
	return { provide: BrnNavigationMenuFocusable, useExisting: focusable };
}
