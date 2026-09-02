import { Directive } from '@angular/core';
import { injectBrnQuestionnaireChoice } from './brn-questionnaire.token';

@Directive({
	selector: '[brnQuestionnaireChoiceLabel]',
	exportAs: 'brnQuestionnaireChoiceLabel',
})
export class BrnQuestionnaireChoiceLabel {
	constructor() {
		injectBrnQuestionnaireChoice();
	}
}
