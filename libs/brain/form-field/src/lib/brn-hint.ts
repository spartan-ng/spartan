import { computed, Directive, inject, input } from '@angular/core';
import { injectBrnFormFieldContext } from './brn-form-field-context';

let uniqueId = 0;

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'brn-hint',
	host: {
		'[id]': 'id()',
	},
})
export class BrnHint {
	private readonly _formFieldContext = (() => {
		try {
			return injectBrnFormFieldContext();
		} catch {
			return null;
		}
	})();

	/** The unique id for the hint */
	public readonly id = input(`brn-hint-${uniqueId++}`);

	/** Whether this hint should be shown based on form field state */
	public readonly shouldShow = computed(() => {
		if (!this._formFieldContext) return true; // Show by default if no context
		return !this._formFieldContext.errorState(); // Hide when there are errors
	});
}
