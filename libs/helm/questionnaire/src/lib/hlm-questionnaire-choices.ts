import { Directive } from '@angular/core';
import { BrnQuestionnaireChoices } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmQuestionnaireChoices]',
	exportAs: 'hlmQuestionnaireChoices',
	hostDirectives: [{ directive: BrnQuestionnaireChoices }],
	host: {
		'data-slot': 'questionnaire-choices',
	},
})
export class HlmQuestionnaireChoices {
	constructor() {
		classes(() => 'spartan-questionnaire-choices group/questionnaire-choices grid min-w-0');
	}
}
