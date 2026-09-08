import { Directive } from '@angular/core';
import { injectBrnQuestionnaireItem } from './brn-questionnaire.token';

@Directive({
	selector: 'legend[brnQuestionnaireTitle]',
	exportAs: 'brnQuestionnaireTitle',
})
export class BrnQuestionnaireTitle {
	constructor() {
		injectBrnQuestionnaireItem();
	}
}
