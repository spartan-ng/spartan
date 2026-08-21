import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { injectBrnQuestionnaire } from './brn-questionnaire.token';

@Directive({
	selector: 'button[brnQuestionnaireSubmit]',
	exportAs: 'brnQuestionnaireSubmit',
	host: {
		type: 'submit',
		'[attr.aria-hidden]': '!visible() || null',
		'[attr.hidden]': '!visible() || null',
		'[attr.inert]': '!visible() || null',
		'[attr.data-visible]': 'visible() ? "" : null',
		'[attr.data-hidden]': 'visible() ? null : ""',
		'[attr.aria-keyshortcuts]': 'shortcut() ?? null',
		'[attr.tabindex]': 'visible() ? null : -1',
		'[attr.disabled]': 'disabled() || null',
	},
})
export class BrnQuestionnaireSubmit {
	private readonly _questionnaire = injectBrnQuestionnaire();

	public readonly disabled = input(false, { transform: booleanAttribute });

	public readonly visible = computed(() => this._questionnaire.total() > 0 && this._questionnaire.last());
	public readonly status = this._questionnaire.activeItemStatus;
	public readonly shortcut = computed(() => (this.visible() && !this.disabled() ? ('Enter' as const) : null));
}
