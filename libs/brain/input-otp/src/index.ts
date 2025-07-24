import { NgModule } from '@angular/core';
import { BrnInputOtp } from './lib/brn-input-otp';
import { BrnInputOtpSlot } from './lib/brn-input-otp-slot';

export * from './lib/brn-input-otp';
export * from './lib/brn-input-otp-slot';

export const BrnInputOtpImports = [BrnInputOtp, BrnInputOtpSlot] as const;

@NgModule({
	imports: [...BrnInputOtpImports],
	exports: [...BrnInputOtpImports],
})
export class BrnInputOtpModule {}
