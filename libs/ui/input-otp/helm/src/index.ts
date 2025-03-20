import { NgModule } from '@angular/core';
import { HlmInputOtpFakeCaretComponent } from './lib/hlm-input-otp-fake-caret.component';
import { HlmInputOtpGroupDirective } from './lib/hlm-input-otp-group.directive';
import { HlmInputOtpSeparatorComponent } from './lib/hlm-input-otp-separator.component';
import { HlmInputOtpSlotDirective } from './lib/hlm-input-otp-slot.directive';
import { HlmInputOtpDirective } from './lib/hlm-input-otp.directive';

export * from './lib/hlm-input-otp-fake-caret.component';
export * from './lib/hlm-input-otp-group.directive';
export * from './lib/hlm-input-otp-separator.component';
export * from './lib/hlm-input-otp-slot.directive';
export * from './lib/hlm-input-otp.directive';

@NgModule({
	imports: [
		HlmInputOtpDirective,
		HlmInputOtpGroupDirective,
		HlmInputOtpSeparatorComponent,
		HlmInputOtpSlotDirective,
		HlmInputOtpFakeCaretComponent,
	],
	exports: [
		HlmInputOtpDirective,
		HlmInputOtpGroupDirective,
		HlmInputOtpSeparatorComponent,
		HlmInputOtpSlotDirective,
		HlmInputOtpFakeCaretComponent,
	],
})
export class HlmInputOtpModule {}
