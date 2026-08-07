import { computed, Directive } from '@angular/core';
import { injectBrnQuestionnaire } from './brn-questionnaire.token';

@Directive({
	selector: '[brnQuestionnaireProgress]',
	exportAs: 'brnQuestionnaireProgress',
	host: {
		role: 'progressbar',
		'[attr.aria-label]': '"Questionnaire progress"',
		'[attr.aria-live]': '"polite"',
		'[attr.aria-valuemax]': '_total() || null',
		'[attr.aria-valuemin]': '_total() ? 1 : null',
		'[attr.aria-valuenow]': '_total() ? _current() : null',
		'[attr.aria-valuetext]': '_label()',
	},
})
export class BrnQuestionnaireProgress {
	private readonly _questionnaire = injectBrnQuestionnaire();

	protected readonly _current = this._questionnaire.current;
	protected readonly _total = this._questionnaire.total;
	public readonly first = this._questionnaire.first;
	public readonly last = this._questionnaire.last;
	public readonly current = this._questionnaire.current;
	public readonly total = this._questionnaire.total;

	protected readonly _label = computed(() => {
		const total = this._total();
		return total ? `Question ${this._current()} of ${total}` : null;
	});

	public readonly label = this._label;
}
