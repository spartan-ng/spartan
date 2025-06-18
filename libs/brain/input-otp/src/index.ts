import { NgModule } from '@angular/core';
import { BrnInputOtpSlotComponent } from './lib/brn-input-otp-slot.component';
import { BrnInputOtpComponent } from './lib/brn-input-otp.component';

export * from './lib/brn-input-otp-slot.component';
export * from './lib/brn-input-otp.component';

export const BrnInputOtpImports = [BrnInputOtpComponent, BrnInputOtpSlotComponent] as const;

@NgModule({
	imports: [...BrnInputOtpImports],
	exports: [...BrnInputOtpImports],
})
export class BrnInputOtpModule {}
