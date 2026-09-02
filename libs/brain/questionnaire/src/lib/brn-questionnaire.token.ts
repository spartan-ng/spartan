import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnQuestionnaire } from './brn-questionnaire';
import type { BrnQuestionnaireChoice } from './brn-questionnaire-choice';
import type { BrnQuestionnaireItem } from './brn-questionnaire-item';

const BrnQuestionnaireToken = new InjectionToken<BrnQuestionnaire>('BrnQuestionnaireToken');
const BrnQuestionnaireItemToken = new InjectionToken<BrnQuestionnaireItem>('BrnQuestionnaireItemToken');
const BrnQuestionnaireChoiceToken = new InjectionToken<BrnQuestionnaireChoice>('BrnQuestionnaireChoiceToken');

export function provideBrnQuestionnaire(directive: Type<BrnQuestionnaire>): ExistingProvider {
	return { provide: BrnQuestionnaireToken, useExisting: directive };
}

export function injectBrnQuestionnaire(): BrnQuestionnaire {
	const questionnaire = inject(BrnQuestionnaireToken, { optional: true });

	if (!questionnaire) {
		throw new Error('Questionnaire parts must be used within a brnQuestionnaire root.');
	}

	return questionnaire;
}

export function provideBrnQuestionnaireItem(directive: Type<BrnQuestionnaireItem>): ExistingProvider {
	return { provide: BrnQuestionnaireItemToken, useExisting: directive };
}

export function injectBrnQuestionnaireItem(): BrnQuestionnaireItem {
	const item = inject(BrnQuestionnaireItemToken, { optional: true });

	if (!item) {
		throw new Error('Questionnaire item parts must be used within a brnQuestionnaireItem.');
	}

	return item;
}

export function provideBrnQuestionnaireChoice(directive: Type<BrnQuestionnaireChoice>): ExistingProvider {
	return { provide: BrnQuestionnaireChoiceToken, useExisting: directive };
}

export function injectBrnQuestionnaireChoice(): BrnQuestionnaireChoice {
	const choice = inject(BrnQuestionnaireChoiceToken, { optional: true });

	if (!choice) {
		throw new Error('Questionnaire choice parts must be used within a brnQuestionnaireChoice.');
	}

	return choice;
}
