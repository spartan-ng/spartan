import { NgModule } from '@angular/core';
import { BrnInputOtpSlotComponent } from './lib/brn-input-otp-slot.component';
import { BrnInputOtpComponent } from './lib/brn-input-otp.component';

export * from './lib/brn-input-otp-slot.component';
export * from './lib/brn-input-otp.component';

@NgModule({
	imports: [BrnInputOtpComponent, BrnInputOtpSlotComponent],
	exports: [BrnInputOtpComponent, BrnInputOtpSlotComponent],
})
export class BrnInputOtpModule {}
