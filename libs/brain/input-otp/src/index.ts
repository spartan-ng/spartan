import { BrnInputOtp } from './lib/brn-input-otp';
import { BrnInputOtpInput } from './lib/brn-input-otp-input';
import { BrnInputOtpSlot } from './lib/brn-input-otp-slot';

export * from './lib/brn-input-otp';
export * from './lib/brn-input-otp-input';
export * from './lib/brn-input-otp-slot';

export const BrnInputOtpImports = [BrnInputOtp, BrnInputOtpInput, BrnInputOtpSlot] as const;
