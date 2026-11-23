import { inject, InjectionToken } from '@angular/core';
import type { BrnToolCall } from './brn-tool-call';

export const BRN_TOOL_CALL_TOKEN = new InjectionToken<BrnToolCall>('BRN_TOOL_CALL_TOKEN');

export function injectBrnToolCall(options?: { optional?: false }): BrnToolCall;
export function injectBrnToolCall(options: { optional: true }): BrnToolCall | null;
export function injectBrnToolCall(options?: { optional?: boolean }): BrnToolCall | null {
	return inject(BRN_TOOL_CALL_TOKEN, { optional: options?.optional });
}
