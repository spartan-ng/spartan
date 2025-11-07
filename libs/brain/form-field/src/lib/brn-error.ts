import { computed, Directive, inject, input } from '@angular/core';
import { injectBrnFormFieldContext } from './brn-form-field-context';

let uniqueId = 0;

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'brn-error',
	host: {
		'[id]': 'id()',
		'[attr.aria-live]': 'polite',
		'[attr.role]': 'alert',
	},
})
export class BrnError {
	private readonly _formFieldContext = (() => {
		try {
			return injectBrnFormFieldContext();
		} catch {
			return null;
		}
	})();

	/** The unique id for the error */
	public readonly id = input(`brn-error-${uniqueId++}`);

	/** Whether this error should be shown based on form field state */
	public readonly shouldShow = computed(() => {
		if (!this._formFieldContext) return true; // Show by default if no context
		return this._formFieldContext.errorState();
	});
}
