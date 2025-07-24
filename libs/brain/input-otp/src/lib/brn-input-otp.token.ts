import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import { BrnInputOtp } from './brn-input-otp';

export const BrnInputOtpToken = new InjectionToken<BrnInputOtp>('BrnInputOtpToken');

export function injectBrnInputOtp(): BrnInputOtp {
	return inject(BrnInputOtpToken) as BrnInputOtp;
}

export function provideBrnInputOtp(inputOtp: Type<BrnInputOtp>): ExistingProvider {
	return { provide: BrnInputOtpToken, useExisting: inputOtp };
}
