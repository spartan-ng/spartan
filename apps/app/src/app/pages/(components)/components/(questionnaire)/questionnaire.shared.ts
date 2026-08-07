import type {
	BrnQuestionnaireItemDefinition,
	BrnQuestionnaireItemStatus,
	BrnQuestionnaireShortcutMode,
} from '@spartan-ng/brain/questionnaire';

export type QuestionnaireShortcutMode = BrnQuestionnaireShortcutMode | null;
export type QuestionnaireItemStatus = BrnQuestionnaireItemStatus;
export type QuestionnaireItems = readonly BrnQuestionnaireItemDefinition[];

export function formValue(form: HTMLFormElement, name: string, emptyLabel = 'None'): string {
	const value = new FormData(form).get(name);
	if (value == null || value === '') {
		return emptyLabel;
	}
	return String(value);
}

export function formValues(form: HTMLFormElement, name: string, emptyLabel = 'None'): string {
	const values = new FormData(form)
		.getAll(name)
		.map(String)
		.filter((value) => value.length > 0);
	return values.length ? values.join(', ') : emptyLabel;
}
