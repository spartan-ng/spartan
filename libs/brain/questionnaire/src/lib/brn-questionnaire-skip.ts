import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { injectBrnQuestionnaire } from './brn-questionnaire.token';

@Directive({
	selector: 'button[brnQuestionnaireSkip]',
	exportAs: 'brnQuestionnaireSkip',
	host: {
		type: 'button',
		'[attr.aria-hidden]': '!visible() || null',
		'[attr.hidden]': '!visible() || null',
		'[attr.inert]': '!visible() || null',
		'[attr.data-visible]': 'visible() ? "" : null',
		'[attr.data-hidden]': 'visible() ? null : ""',
		'[attr.tabindex]': 'visible() ? null : -1',
		'[attr.disabled]': 'disabled() || null',
		'(click)': 'onClick($event)',
	},
})
export class BrnQuestionnaireSkip {
	private readonly _questionnaire = injectBrnQuestionnaire();

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly visible = computed(() => this._questionnaire.activeItemRequired() === false);
	public readonly status = this._questionnaire.activeItemStatus;

	protected onClick(event: Event): void {
		if (event.defaultPrevented) {
			return;
		}

		this._questionnaire.skipCurrent();
	}
}
