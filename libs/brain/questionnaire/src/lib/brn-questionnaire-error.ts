import { computed, Directive, effect, input } from '@angular/core';
import { injectBrnQuestionnaireItem } from './brn-questionnaire.token';

let nextErrorId = 0;

@Directive({
	selector: '[brnQuestionnaireError]',
	exportAs: 'brnQuestionnaireError',
	host: {
		'[attr.id]': '_errorId()',
		'[attr.hidden]': '!_item.invalid() || null',
		'[attr.role]': '_item.invalid() ? "alert" : null',
	},
})
export class BrnQuestionnaireError {
	protected readonly _item = injectBrnQuestionnaireItem();
	private readonly _generatedId = `brn-questionnaire-error-${++nextErrorId}`;

	public readonly id = input<string | undefined>(undefined);
	protected readonly _errorId = computed(() => this.id() ?? this._generatedId);

	public readonly defaultMessage = computed(() =>
		this._item.required() ? 'Choose an answer to continue.' : 'Choose an answer or skip this question.',
	);

	constructor() {
		effect((onCleanup) => {
			onCleanup(this._item.registerError(this._errorId()));
		});
	}
}
