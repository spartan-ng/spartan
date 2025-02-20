import { NgFor, NgIf } from '@angular/common';
import { Component, computed } from '@angular/core';
import { HlmInputErrorDirective } from '@spartan-ng/ui-input-helm';
import { injectErrorField } from 'ng-signal-forms';

@Component({
	selector: 'spartan-input-error',
	imports: [NgIf, NgFor, HlmInputErrorDirective],
	hostDirectives: [HlmInputErrorDirective],
	host: {
		class: 'block mt-1 min-h-[20px] mb-4',
		'[class.invisible]': "touchedState() === 'UNTOUCHED'",
	},
	template: `
		<p *ngFor="let message of errorMessages()">{{ message }}</p>
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
