import { type ExistingProvider, InjectionToken, type Signal, type Type } from '@angular/core';

export interface HlmDatePickerTrigger {
	triggerId: Signal<string>;
}

export const HlmDatePickerTriggerToken = new InjectionToken<HlmDatePickerTrigger>('HlmDatePickerTriggerToken');

export function provideHlmDatePickerTrigger(instance: Type<HlmDatePickerTrigger>): ExistingProvider {
	return { provide: HlmDatePickerTriggerToken, useExisting: instance };
}
