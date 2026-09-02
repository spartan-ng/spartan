import { Directive } from '@angular/core';
import { injectBrnQuestionnaireChoice } from './brn-questionnaire.token';

@Directive({
	selector: '[brnQuestionnaireChoiceShortcut]',
	exportAs: 'brnQuestionnaireChoiceShortcut',
	host: {
		'[attr.aria-hidden]': 'true',
		'[attr.hidden]': '_choice.shortcut() === null || null',
	},
})
export class BrnQuestionnaireChoiceShortcut {
	protected readonly _choice = injectBrnQuestionnaireChoice();
}
