import { type ExistingProvider, InjectionToken, type Signal, type Type } from '@angular/core';

export interface HlmDatePickerTriggerBase {
	triggerId: Signal<string>;
}

export const HlmDatePickerTriggerToken = new InjectionToken<HlmDatePickerTriggerBase>('HlmDatePickerTriggerToken');

export function provideHlmDatePickerTrigger(instance: Type<HlmDatePickerTriggerBase>): ExistingProvider {
	return { provide: HlmDatePickerTriggerToken, useExisting: instance };
}
