export type BrnQuestionnaireItemStatus = 'unanswered' | 'answered' | 'skipped';
export type BrnQuestionnaireShortcutMode = 'letters' | 'numbers';

export type BrnQuestionnaireChoiceDefinition = {
	disabled?: boolean;
	value: string;
};

export type BrnQuestionnaireItemDefinition = {
	choices?: readonly BrnQuestionnaireChoiceDefinition[];
	disabled?: boolean;
	name: string;
	required?: boolean;
};

export type BrnQuestionnaireRootState = {
	current: number;
	first: boolean;
	last: boolean;
	total: number;
};

export type BrnQuestionnaireInputType =
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'month'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week';

export type BrnAnswerControlRegistration = {
	disabled: boolean;
	element: HTMLInputElement;
	id: string;
} & (
	| {
			ownDisabled: boolean;
			type: 'choice';
			value: string;
	  }
	| {
			type: 'input';
	  }
);

export type BrnChoiceRegistration = {
	disabled: boolean;
	value: string;
};

export type BrnItemRegistration = {
	choices: readonly BrnChoiceRegistration[];
	disabled: boolean;
	element: HTMLFieldSetElement;
	focus: () => void;
	focusInvalid: () => void;
	getAnswerByElement: (element: Element) => BrnAnswerControlRegistration | null;
	getAnswerByShortcut: (shortcut: string) => BrnAnswerControlRegistration | null;
	moveAnswerFocus: (element: Element, direction: 'next' | 'previous') => boolean;
	name: string;
	required: boolean;
	reset: () => void;
	skip: () => void;
	status: BrnQuestionnaireItemStatus;
	validate: () => boolean;
};

export type BrnPendingFocus = {
	name: string;
	target: 'invalid' | 'item';
};
