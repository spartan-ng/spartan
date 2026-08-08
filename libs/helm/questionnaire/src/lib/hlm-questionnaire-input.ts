import { Directive } from '@angular/core';
import { BrnQuestionnaireInput } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'input[hlmQuestionnaireInput]',
	exportAs: 'hlmQuestionnaireInput',
	hostDirectives: [
		{
			directive: BrnQuestionnaireInput,
			inputs: ['type', 'disabled', 'value', 'defaultValue'],
		},
	],
	host: {
		'data-slot': 'questionnaire-input',
	},
})
export class HlmQuestionnaireInput {
	constructor() {
		classes(() => 'spartan-questionnaire-input');
	}
}
