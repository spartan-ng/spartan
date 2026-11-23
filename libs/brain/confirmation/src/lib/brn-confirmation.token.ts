import { inject, InjectionToken } from '@angular/core';
import type { BrnConfirmation } from './brn-confirmation';

export const BRN_CONFIRMATION_TOKEN = new InjectionToken<BrnConfirmation>('BRN_CONFIRMATION_TOKEN');

export function injectBrnConfirmation(options?: { optional?: false }): BrnConfirmation;
export function injectBrnConfirmation(options: { optional: true }): BrnConfirmation | null;
export function injectBrnConfirmation(options?: { optional?: boolean }): BrnConfirmation | null {
	return inject(BRN_CONFIRMATION_TOKEN, { optional: options?.optional });
}
