import { NgModule } from '@angular/core';
import { HlmInputOtpFakeCaretComponent } from './lib/hlm-input-otp-fake-caret.component';
import { HlmInputOtpGroupDirective } from './lib/hlm-input-otp-group.directive';
import { HlmInputOtpSeparatorComponent } from './lib/hlm-input-otp-separator.component';
import { HlmInputOtpSlotComponent } from './lib/hlm-input-otp-slot.component';
import { HlmInputOtpDirective } from './lib/hlm-input-otp.directive';

export * from './lib/hlm-input-otp-fake-caret.component';
export * from './lib/hlm-input-otp-group.directive';
export * from './lib/hlm-input-otp-separator.component';
export * from './lib/hlm-input-otp-slot.component';
export * from './lib/hlm-input-otp.directive';

export const HlmInputOtpImports = [
	HlmInputOtpDirective,
	HlmInputOtpGroupDirective,
	HlmInputOtpSeparatorComponent,
	HlmInputOtpSlotComponent,
	HlmInputOtpFakeCaretComponent,
] as const;

@NgModule({
	imports: [...HlmInputOtpImports],
	exports: [...HlmInputOtpImports],
})
export class HlmInputOtpModule {}
