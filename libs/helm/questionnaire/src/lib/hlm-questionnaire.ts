import { Directive } from '@angular/core';
import { BrnQuestionnaire } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'form[hlmQuestionnaire]',
	exportAs: 'hlmQuestionnaire',
	hostDirectives: [
		{
			directive: BrnQuestionnaire,
			inputs: ['items', 'defaultItem', 'item', 'shortcuts', 'noValidate'],
			outputs: ['itemChange'],
		},
	],
	host: {
		'data-slot': 'questionnaire',
	},
})
export class HlmQuestionnaire {
	constructor() {
		classes(() => 'spartan-questionnaire');
	}
}
