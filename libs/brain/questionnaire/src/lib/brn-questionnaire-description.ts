import { computed, Directive, effect, input } from '@angular/core';
import { injectBrnQuestionnaireItem } from './brn-questionnaire.token';

let nextDescriptionId = 0;

@Directive({
	selector: '[brnQuestionnaireDescription]',
	exportAs: 'brnQuestionnaireDescription',
	host: {
		'[attr.id]': '_descriptionId()',
	},
})
export class BrnQuestionnaireDescription {
	private readonly _item = injectBrnQuestionnaireItem();
	private readonly _generatedId = `brn-questionnaire-description-${++nextDescriptionId}`;

	public readonly id = input<string | undefined>(undefined);
	protected readonly _descriptionId = computed(() => this.id() ?? this._generatedId);

	constructor() {
		effect((onCleanup) => {
			onCleanup(this._item.registerDescription(this._descriptionId()));
		});
	}
}
