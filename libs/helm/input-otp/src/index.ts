import { HlmInputOtp } from './lib/hlm-input-otp';
import { HlmInputOtpFakeCaret } from './lib/hlm-input-otp-fake-caret';
import { HlmInputOtpGroup } from './lib/hlm-input-otp-group';
import { HlmInputOtpSeparator } from './lib/hlm-input-otp-separator';
import { HlmInputOtpSlot } from './lib/hlm-input-otp-slot';

export * from './lib/hlm-input-otp';
export * from './lib/hlm-input-otp-fake-caret';
export * from './lib/hlm-input-otp-group';
export * from './lib/hlm-input-otp-separator';
export * from './lib/hlm-input-otp-slot';

export const HlmInputOtpImports = [
	HlmInputOtp,
	HlmInputOtpGroup,
	HlmInputOtpSeparator,
	HlmInputOtpSlot,
	HlmInputOtpFakeCaret,
] as const;
