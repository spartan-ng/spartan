import { BrnInputOtp } from './lib/brn-input-otp';
import { BrnInputOtpSlot } from './lib/brn-input-otp-slot';

export * from './lib/brn-input-otp';
export * from './lib/brn-input-otp-slot';

export const BrnInputOtpImports = [BrnInputOtp, BrnInputOtpSlot] as const;
