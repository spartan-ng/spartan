import { Directive } from '@angular/core';
import { injectBrnQuestionnaireItem } from './brn-questionnaire.token';

@Directive({
	selector: '[brnQuestionnaireChoices]',
	exportAs: 'brnQuestionnaireChoices',
	host: {
		'[attr.data-shortcuts]': '_item.shortcuts() ?? null',
	},
})
export class BrnQuestionnaireChoices {
	protected readonly _item = injectBrnQuestionnaireItem();
	public readonly shortcuts = this._item.shortcuts;
}
