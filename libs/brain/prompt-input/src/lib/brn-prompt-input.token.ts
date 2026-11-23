import { inject, InjectionToken } from '@angular/core';
import type { BrnPromptInput } from './brn-prompt-input';

export const BRN_PROMPT_INPUT_TOKEN = new InjectionToken<BrnPromptInput>('BRN_PROMPT_INPUT_TOKEN');

export function injectBrnPromptInput(options?: { optional?: false }): BrnPromptInput;
export function injectBrnPromptInput(options: { optional: true }): BrnPromptInput | null;
export function injectBrnPromptInput(options?: { optional?: boolean }): BrnPromptInput | null {
	return inject(BRN_PROMPT_INPUT_TOKEN, { optional: options?.optional });
}
