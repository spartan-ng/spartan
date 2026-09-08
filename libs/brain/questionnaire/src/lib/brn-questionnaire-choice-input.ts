import { Directive, effect, ElementRef, inject } from '@angular/core';
import { injectBrnQuestionnaireChoice } from './brn-questionnaire.token';

@Directive({
	selector: 'input[brnQuestionnaireChoiceInput]',
	exportAs: 'brnQuestionnaireChoiceInput',
	host: {
		'[attr.id]': '_choice.inputId()',
		'[attr.name]': '_choice.inputName() ?? null',
		'[attr.type]': '_choice.type()',
		'[attr.value]': '_choice.value()',
		'[attr.disabled]': '_choice.disabled() || null',
		'[attr.required]': '_choice.inputRequired() || null',
		'[attr.aria-invalid]': '_choice.invalid() ? "true" : null',
		'[attr.aria-keyshortcuts]': '_choice.inputAriaKeyShortcuts() ?? null',
		'[attr.data-checked]': '_choice.checked() ? "" : null',
		'[attr.data-unchecked]': '_choice.checked() ? null : ""',
		'(change)': '_choice.onInputChange($event)',
	},
})
export class BrnQuestionnaireChoiceInput {
	protected readonly _choice = injectBrnQuestionnaireChoice();
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	constructor() {
		effect(() => {
			this._choice.setInputElement(this._elementRef.nativeElement);
		});

		// Keep the native checked property aligned with questionnaire state.
		// Avoid [checked] template bindings that can fight radio group clicks.
		effect(() => {
			const input = this._elementRef.nativeElement;
			const checked = this._choice.checked();
			if (input.checked !== checked) {
				input.checked = checked;
			}
		});
	}
}
