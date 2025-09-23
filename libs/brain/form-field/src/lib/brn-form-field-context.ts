import { inject, InjectionToken, type Signal } from '@angular/core';
import { type NgControl } from '@angular/forms';

export interface BrnFormFieldContextValue {
	/** The form control associated with this field */
	control: Signal<NgControl | null>;
	/** Whether the field is in an error state */
	errorState: Signal<boolean>;
	/** Whether the field is required */
	required: Signal<boolean>;
	/** Whether the field is disabled */
	disabled: Signal<boolean>;
	/** The field's unique ID */
	id: Signal<string>;
}

const BrnFormFieldContextToken = new InjectionToken<BrnFormFieldContextValue>('BrnFormFieldContext');

export function injectBrnFormFieldContext(): BrnFormFieldContextValue {
	return inject(BrnFormFieldContextToken);
}

export function provideBrnFormFieldContext(context: BrnFormFieldContextValue) {
	return {
		provide: BrnFormFieldContextToken,
		useValue: context,
	};
}
