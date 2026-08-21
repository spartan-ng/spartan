import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmQuestionnaireActions]',
	exportAs: 'hlmQuestionnaireActions',
	host: {
		'data-slot': 'questionnaire-actions',
	},
})
export class HlmQuestionnaireActions {
	constructor() {
		classes(() => 'spartan-questionnaire-actions');
	}
}
