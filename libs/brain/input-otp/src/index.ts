import { BrnInputOtp } from './lib/brn-input-otp';
import { BrnInputOtpMask } from './lib/brn-input-otp-mask';
import { BrnInputOtpSlot } from './lib/brn-input-otp-slot';

export * from './lib/brn-input-otp';
export * from './lib/brn-input-otp-mask';
export * from './lib/brn-input-otp-slot';

export const BrnInputOtpImports = [BrnInputOtp, BrnInputOtpSlot, BrnInputOtpMask] as const;
