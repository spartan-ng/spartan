import type {
	BrnQuestionnaireItemDefinition,
	BrnQuestionnaireItemStatus,
	BrnQuestionnaireShortcutMode,
} from '@spartan-ng/brain/questionnaire';

export type QuestionnaireShortcutMode = BrnQuestionnaireShortcutMode | null;
export type QuestionnaireItemStatus = BrnQuestionnaireItemStatus;
export type QuestionnaireItems = readonly BrnQuestionnaireItemDefinition[];

export function answerLabel(value: string | string[], emptyLabel = 'None'): string {
	if (Array.isArray(value)) {
		return value.length ? value.join(', ') : emptyLabel;
	}

	return value.length ? value : emptyLabel;
}
