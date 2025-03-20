import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import { BrnInputOtpComponent } from './brn-input-otp.component';

export const BrnInputOtpToken = new InjectionToken<BrnInputOtpComponent>('BrnInputOtpToken');

export function injectBrnInputOtp(): BrnInputOtpComponent {
	return inject(BrnInputOtpToken) as BrnInputOtpComponent;
}

export function provideBrnInputOtp(inputOtp: Type<BrnInputOtpComponent>): ExistingProvider {
	return { provide: BrnInputOtpToken, useExisting: inputOtp };
}
