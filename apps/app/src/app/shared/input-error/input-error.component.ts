import { Component, computed } from '@angular/core';
import { injectErrorField } from 'ng-signal-forms';

@Component({
	selector: 'spartan-input-error',
	host: {
		class: 'block mt-1 min-h-[20px] mb-4',
		'[class.invisible]': "touchedState() === 'UNTOUCHED'",
	},
	template: `
		@for (message of errorMessages(); track message) {
			<p>{{ message }}</p>
		}
	`,
})
export class InputErrorComponent {
	private readonly _formField = injectErrorField();
	public touchedState = this._formField.touchedState;
	public errors = this._formField.errors;

	public errorMessages = computed(() =>
		Object.values(this.errors() ?? {}).map((error) => error.message ?? 'Field invalid'),
	);
}
