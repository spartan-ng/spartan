import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { injectBrnQuestionnaire } from './brn-questionnaire.token';

@Directive({
	selector: 'button[brnQuestionnaireNext]',
	exportAs: 'brnQuestionnaireNext',
	host: {
		type: 'button',
		'[attr.aria-hidden]': '!visible() || null',
		'[attr.hidden]': '!visible() || null',
		'[attr.inert]': '!visible() || null',
		'[attr.data-visible]': 'visible() ? "" : null',
		'[attr.data-hidden]': 'visible() ? null : ""',
		'[attr.aria-keyshortcuts]': 'shortcut() ?? null',
		'[attr.tabindex]': 'visible() ? null : -1',
		'[attr.disabled]': 'disabled() || null',
		'(click)': 'onClick($event)',
	},
})
export class BrnQuestionnaireNext {
	private readonly _questionnaire = injectBrnQuestionnaire();

	public readonly disabled = input(false, { transform: booleanAttribute });

	public readonly visible = computed(() => this._questionnaire.total() > 1 && !this._questionnaire.last());
	public readonly status = this._questionnaire.activeItemStatus;
	public readonly shortcut = computed(() => (this.visible() && !this.disabled() ? ('Enter' as const) : null));

	protected onClick(event: Event): void {
		if (event.defaultPrevented) {
			return;
		}

		this._questionnaire.goNext();
	}
}
