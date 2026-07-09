import { type ExistingProvider, InjectionToken, type Signal, type Type } from '@angular/core';

export interface BrnDatePickerTriggerBase {
	triggerId: Signal<string>;
}

export const BrnDatePickerTriggerToken = new InjectionToken<BrnDatePickerTriggerBase>('BrnDatePickerTriggerToken');

export function provideBrnDatePickerTrigger(instance: Type<BrnDatePickerTriggerBase>): ExistingProvider {
	return { provide: BrnDatePickerTriggerToken, useExisting: instance };
}
