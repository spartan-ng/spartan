import type {
	BrnAnswerControlRegistration,
	BrnItemRegistration,
	BrnQuestionnaireShortcutMode,
} from './brn-questionnaire.types';

export function hasInputValue(value: unknown): boolean {
	if (Array.isArray(value)) {
		return value.some((item) => String(item).trim().length > 0);
	}

	return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function getShortcutKeys(shortcuts: BrnQuestionnaireShortcutMode | null): string[] {
	if (shortcuts === 'letters') {
		return Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
	}

	if (shortcuts === 'numbers') {
		return Array.from({ length: 9 }, (_, index) => String(index + 1));
	}

	return [];
}

export function getShortcutFromKey(key: string, shortcuts: BrnQuestionnaireShortcutMode): string | null {
	const normalizedKey = shortcuts === 'letters' ? key.toUpperCase() : key;
	return getShortcutKeys(shortcuts).includes(normalizedKey) ? normalizedKey : null;
}

export function getAnswerKeyShortcuts(shortcut: string | null, filled: boolean): string | undefined {
	return [shortcut, filled ? 'Enter' : null].filter(Boolean).join(' ') || undefined;
}

export function isAnswerFilled(answer: BrnAnswerControlRegistration): boolean {
	if (answer.type === 'choice') {
		return answer.element.checked;
	}

	return answer.element.hasAttribute('name') && hasInputValue(answer.element.value);
}

export function isEmptyNavigableInput(answer: BrnAnswerControlRegistration | null): boolean {
	return (
		answer?.type === 'input' &&
		['email', 'password', 'search', 'tel', 'text', 'url'].includes(answer.element.type) &&
		!hasInputValue(answer.element.value)
	);
}

export function isTextEntryTarget(element: Element): boolean {
	if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
		return true;
	}

	if (element instanceof HTMLInputElement) {
		return !['button', 'checkbox', 'radio', 'reset', 'submit'].includes(element.type);
	}

	return element instanceof HTMLElement && element.isContentEditable;
}

export function isRadioTarget(element: Element): boolean {
	return element instanceof HTMLInputElement && element.type === 'radio';
}

export function compareItemOrder(firstItem: BrnItemRegistration, secondItem: BrnItemRegistration): number {
	if (firstItem.element === secondItem.element) {
		return 0;
	}

	const position = firstItem.element.compareDocumentPosition(secondItem.element);

	if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
		return -1;
	}

	if (position & Node.DOCUMENT_POSITION_PRECEDING) {
		return 1;
	}

	return 0;
}

export function compareAnswerOrder(
	firstAnswer: BrnAnswerControlRegistration,
	secondAnswer: BrnAnswerControlRegistration,
): number {
	if (firstAnswer.element === secondAnswer.element) {
		return 0;
	}

	const position = firstAnswer.element.compareDocumentPosition(secondAnswer.element);

	if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
		return -1;
	}

	if (position & Node.DOCUMENT_POSITION_PRECEDING) {
		return 1;
	}

	return 0;
}
