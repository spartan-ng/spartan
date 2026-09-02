import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmQuestionnaireChoiceDescription]',
	exportAs: 'hlmQuestionnaireChoiceDescription',
	host: {
		'data-slot': 'questionnaire-choice-description',
	},
})
export class HlmQuestionnaireChoiceDescription {
	constructor() {
		classes(() => 'spartan-questionnaire-choice-description');
	}
}
