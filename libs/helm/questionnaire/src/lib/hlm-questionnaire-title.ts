import { Directive } from '@angular/core';
import { BrnQuestionnaireTitle } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'legend[hlmQuestionnaireTitle]',
	exportAs: 'hlmQuestionnaireTitle',
	hostDirectives: [{ directive: BrnQuestionnaireTitle }],
	host: {
		'data-slot': 'questionnaire-title',
	},
})
export class HlmQuestionnaireTitle {
	constructor() {
		classes(() => 'spartan-questionnaire-title');
	}
}
