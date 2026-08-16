import { Directive } from '@angular/core';
import { BrnQuestionnaireItem } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'fieldset[hlmQuestionnaireItem]',
	exportAs: 'hlmQuestionnaireItem',
	hostDirectives: [
		{
			directive: BrnQuestionnaireItem,
			inputs: ['name', 'multiple', 'required', 'disabled', 'itemInvalid', 'aria-describedby', 'aria-keyshortcuts'],
			outputs: ['statusChange'],
		},
	],
	host: {
		'data-slot': 'questionnaire-item',
	},
})
export class HlmQuestionnaireItem {
	constructor() {
		classes(() => 'spartan-questionnaire-item');
	}
}
