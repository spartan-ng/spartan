import {
	booleanAttribute,
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	output,
	signal,
} from '@angular/core';
import { getShortcutByChoiceValue } from './brn-questionnaire.collection';
import { injectBrnQuestionnaire, provideBrnQuestionnaireItem } from './brn-questionnaire.token';
import type { BrnAnswerControlRegistration, BrnQuestionnaireItemStatus } from './brn-questionnaire.types';
import {
	compareAnswerOrder,
	getShortcutKeys,
	isAnswerFilled,
	isEmptyNavigableInput,
	isRadioTarget,
	isTextEntryTarget,
} from './brn-questionnaire.utils';

@Directive({
	selector: 'fieldset[brnQuestionnaireItem]',
	exportAs: 'brnQuestionnaireItem',
	providers: [provideBrnQuestionnaireItem(BrnQuestionnaireItem)],
	host: {
		'[attr.aria-describedby]': '_describedBy()',
		'[attr.aria-invalid]': 'invalid() ? "true" : null',
		'[attr.aria-keyshortcuts]': '_keyShortcuts()',
		'[attr.data-active]': 'active() ? "" : null',
		'[attr.data-status]': 'status()',
		'[attr.disabled]': 'disabled() || null',
		'[attr.hidden]': '!active() || null',
		'[attr.inert]': '!active() || null',
		'[attr.tabindex]': '-1',
	},
})
export class BrnQuestionnaireItem {
	private readonly _questionnaire = injectBrnQuestionnaire();
	private readonly _elementRef = inject<ElementRef<HTMLFieldSetElement>>(ElementRef);

	public readonly name = input.required<string>();
	public readonly multiple = input(false, { transform: booleanAttribute });
	public readonly required = input(false, { transform: booleanAttribute });
	public readonly disabled = input(false, { transform: booleanAttribute });
	public readonly externallyInvalid = input(false, { alias: 'invalid', transform: booleanAttribute });
	public readonly ariaDescribedBy = input<string | undefined>(undefined, { alias: 'aria-describedby' });
	public readonly ariaKeyShortcuts = input<string | undefined>(undefined, { alias: 'aria-keyshortcuts' });

	public readonly statusChange = output<BrnQuestionnaireItemStatus>();

	private readonly _answerControlRegistrations = signal<BrnAnswerControlRegistration[]>([]);
	private readonly _validationAttempted = signal(false);
	private readonly _selectedAnswerIds = signal<string[]>([]);
	private readonly _skipped = signal(false);
	private readonly _resetVersion = signal(0);
	private readonly _descriptionIds = signal<string[]>([]);
	private readonly _errorIds = signal<string[]>([]);
	private readonly _defaultSelectedAnswerIds = signal<string[]>([]);
	private _previousStatus: BrnQuestionnaireItemStatus | null = null;

	public readonly active = computed(() => !this.disabled() && this._questionnaire.activeItemName() === this.name());

	private readonly _answerControls = computed(() => {
		this._questionnaire.domVersion();
		return [...this._answerControlRegistrations()].sort(compareAnswerOrder);
	});

	private readonly _answers = computed(() => this._answerControls().filter((registration) => !registration.disabled));

	private readonly _answered = computed(() =>
		this._answers().some((answer) => this._selectedAnswerIds().includes(answer.id)),
	);

	public readonly status = computed((): BrnQuestionnaireItemStatus => {
		if (this._skipped()) {
			return 'skipped';
		}

		return this._answered() ? 'answered' : 'unanswered';
	});

	private readonly _intentionallySkipped = computed(() => this.status() === 'skipped' && !this.required());

	private readonly _valid = computed(
		() =>
			this.disabled() || this._intentionallySkipped() || (!this.externallyInvalid() && this.status() === 'answered'),
	);

	public readonly invalid = computed(
		() =>
			!this.disabled() &&
			!this._intentionallySkipped() &&
			(this.externallyInvalid() || (this._validationAttempted() && !this._valid())),
	);

	public readonly hasInputAnswer = computed(() => this._answers().some((answer) => answer.type === 'input'));

	public readonly selectedAnswerIds = this._selectedAnswerIds.asReadonly();
	public readonly resetVersion = this._resetVersion.asReadonly();
	public readonly shortcuts = this._questionnaire.shortcuts;

	public readonly shortcutByChoiceValue = computed(() => {
		const itemDefinitionByName = this._questionnaire.itemDefinitionByName();

		if (!itemDefinitionByName) {
			return null;
		}

		return getShortcutByChoiceValue(itemDefinitionByName.get(this.name()), this._questionnaire.shortcuts());
	});

	public readonly shortcutByAnswerId = computed(() => {
		// Prefer definition-based shortcuts only when they actually assigned keys.
		// An empty Map must fall through so DOM-order shortcuts still work.
		if ((this.shortcutByChoiceValue()?.size ?? 0) > 0) {
			return new Map<string, string>();
		}

		const keys = getShortcutKeys(this._questionnaire.shortcuts());
		const shortcutAnswers = this._answers().filter((answer) => answer.type === 'choice');

		return new Map(shortcutAnswers.slice(0, keys.length).map((answer, index) => [answer.id, keys[index]]));
	});

	protected readonly _describedBy = computed(
		() =>
			[...this._descriptionIds(), ...(this.invalid() ? this._errorIds() : []), this.ariaDescribedBy()]
				.filter(Boolean)
				.join(' ') || null,
	);

	protected readonly _keyShortcuts = computed(() => {
		const active = this.active();
		const status = this.status();

		return (
			[
				this.ariaKeyShortcuts(),
				active ? 'Meta+Enter Control+Enter' : undefined,
				active && this._answers().length ? 'ArrowUp ArrowDown' : undefined,
				active && !this._questionnaire.first() ? 'ArrowLeft' : undefined,
				active && !this._questionnaire.last() && status !== 'unanswered' ? 'ArrowRight' : undefined,
			]
				.filter(Boolean)
				.join(' ') || null
		);
	});

	constructor() {
		effect(() => {
			const status = this.status();

			if (this._previousStatus === status) {
				return;
			}

			this._previousStatus = status;
			this.statusChange.emit(status);
		});

		effect((onCleanup) => {
			const registration = {
				choices: this._answerControls().flatMap((answer) =>
					answer.type === 'choice' ? [{ disabled: answer.ownDisabled, value: answer.value }] : [],
				),
				disabled: this.disabled(),
				element: this._elementRef.nativeElement,
				focus: () => this.focus(),
				focusInvalid: () => this.focusInvalid(),
				getAnswerByElement: (element: Element) => this.getAnswerByElement(element),
				getAnswerByShortcut: (shortcut: string) => this.getAnswerByShortcut(shortcut),
				moveAnswerFocus: (element: Element, direction: 'next' | 'previous') => this.moveAnswerFocus(element, direction),
				name: this.name(),
				required: this.required(),
				reset: () => this.reset(),
				skip: () => this.skip(),
				status: this.status(),
				validate: () => this.validate(),
			};

			onCleanup(this._questionnaire.registerItem(registration));
		});

		effect(() => {
			const multiple = this.multiple();
			// Collapse multi-selection when switching to single.
			if (multiple) {
				return;
			}

			this._selectedAnswerIds.update((currentAnswerIds) => {
				if (currentAnswerIds.length <= 1) {
					return currentAnswerIds;
				}

				const selectedAnswer = this._answers().find((answer) => currentAnswerIds.includes(answer.id));
				return selectedAnswer ? [selectedAnswer.id] : [];
			});
		});
	}

	public registerAnswerControl(registration: BrnAnswerControlRegistration): () => void {
		this._answerControlRegistrations.update((currentRegistrations) => [
			...currentRegistrations.filter(
				(currentRegistration) =>
					currentRegistration.element !== registration.element && currentRegistration.id !== registration.id,
			),
			registration,
		]);

		return () => {
			this._answerControlRegistrations.update((currentRegistrations) =>
				currentRegistrations.filter((currentRegistration) => currentRegistration !== registration),
			);
		};
	}

	public registerAnswerSelection(answerId: string, defaultSelected: boolean): () => void {
		if (defaultSelected) {
			this._defaultSelectedAnswerIds.update((ids) => [...ids.filter((id) => id !== answerId), answerId]);
			this._selectedAnswerIds.update((currentAnswerIds) => {
				if (!this.multiple()) {
					return currentAnswerIds.length ? currentAnswerIds : [answerId];
				}

				return currentAnswerIds.includes(answerId) ? currentAnswerIds : [...currentAnswerIds, answerId];
			});
		}

		return () => {
			this._defaultSelectedAnswerIds.update((ids) => ids.filter((id) => id !== answerId));
			this._selectedAnswerIds.update((currentAnswerIds) =>
				currentAnswerIds.filter((currentAnswerId) => currentAnswerId !== answerId),
			);
		};
	}

	public setAnswerDefault(answerId: string, defaultSelected: boolean): void {
		if (defaultSelected) {
			this._defaultSelectedAnswerIds.update((ids) => (ids.includes(answerId) ? ids : [...ids, answerId]));
			return;
		}

		this._defaultSelectedAnswerIds.update((ids) => ids.filter((id) => id !== answerId));
	}

	public setAnswerSelectionFromInteraction(answerId: string, selected: boolean): void {
		this._skipped.set(false);
		this.updateAnswerSelected(answerId, selected);
	}

	public syncControlledAnswerSelection(answerId: string, selected: boolean): void {
		if (selected) {
			this._skipped.set(false);
		}

		this.updateAnswerSelected(answerId, selected);
	}

	public registerDescription(descriptionId: string): () => void {
		this._descriptionIds.update((ids) => (ids.includes(descriptionId) ? ids : [...ids, descriptionId]));
		return () => this._descriptionIds.update((ids) => ids.filter((id) => id !== descriptionId));
	}

	public registerError(errorId: string): () => void {
		this._errorIds.update((ids) => (ids.includes(errorId) ? ids : [...ids, errorId]));
		return () => this._errorIds.update((ids) => ids.filter((id) => id !== errorId));
	}

	public validate(): boolean {
		this._validationAttempted.set(true);

		if (!this._valid()) {
			return false;
		}

		if (!this._questionnaire.nativeValidation()) {
			return true;
		}

		const invalidAnswer = this._answers().find(
			(answer) => isAnswerFilled(answer) && answer.element.willValidate && !answer.element.validity.valid,
		);

		if (!invalidAnswer) {
			return true;
		}

		invalidAnswer.element.focus();
		invalidAnswer.element.reportValidity();
		return false;
	}

	public focus(): void {
		this._elementRef.nativeElement.focus();
	}

	public focusInvalid(): void {
		const element = this._elementRef.nativeElement;
		const selectedInput = element.querySelector<HTMLInputElement>('input[data-filled][name]:not(:disabled)');
		const firstControl = element.querySelector<HTMLElement>(
			'input:not([type=hidden]):not(:disabled), textarea:not(:disabled)',
		);

		(selectedInput ?? firstControl ?? element).focus();
	}

	public reset(): void {
		this._validationAttempted.set(false);
		this._skipped.set(false);
		const defaults = this._defaultSelectedAnswerIds();
		this._selectedAnswerIds.set(this.multiple() ? [...defaults] : defaults.slice(0, 1));
		this._resetVersion.update((version) => version + 1);
	}

	public skip(): void {
		if (this.required()) {
			return;
		}

		this._selectedAnswerIds.set([]);
		this._skipped.set(true);
	}

	public getAnswerByElement(answerElement: Element): BrnAnswerControlRegistration | null {
		return this._answers().find((answer) => answer.element === answerElement) ?? null;
	}

	public getAnswerByShortcut(shortcut: string): BrnAnswerControlRegistration | null {
		const shortcutByChoiceValue = this.shortcutByChoiceValue();

		if (shortcutByChoiceValue && shortcutByChoiceValue.size > 0) {
			const choiceValue = Array.from(shortcutByChoiceValue.entries()).find(
				([, choiceShortcut]) => choiceShortcut === shortcut,
			)?.[0];

			return this._answers().find((answer) => answer.type === 'choice' && answer.value === choiceValue) ?? null;
		}

		const answerId = Array.from(this.shortcutByAnswerId().entries()).find(
			([, answerShortcut]) => answerShortcut === shortcut,
		)?.[0];

		return this._answers().find((answer) => answer.id === answerId) ?? null;
	}

	public moveAnswerFocus(currentElement: Element, direction: 'next' | 'previous'): boolean {
		const answers = this._answers();
		const element = this._elementRef.nativeElement;
		const currentIndex = answers.findIndex((answer) => answer.element === currentElement);
		const currentAnswer = currentIndex < 0 ? null : (answers[currentIndex] ?? null);

		if (
			!answers.length ||
			(isTextEntryTarget(currentElement) && !isEmptyNavigableInput(currentAnswer)) ||
			(currentIndex < 0 && currentElement !== element)
		) {
			return false;
		}

		const nextAnswer =
			currentIndex < 0
				? (answers.find(isAnswerFilled) ?? (direction === 'next' ? answers[0] : answers[answers.length - 1]))
				: answers[(currentIndex + (direction === 'next' ? 1 : -1) + answers.length) % answers.length];

		if (!nextAnswer || nextAnswer.element === currentElement) {
			return false;
		}

		if (currentIndex >= 0 && isRadioTarget(currentElement) && isRadioTarget(nextAnswer.element)) {
			return false;
		}

		nextAnswer.element.focus();

		if (nextAnswer.type === 'choice' && isRadioTarget(nextAnswer.element)) {
			nextAnswer.element.click();
		}

		return true;
	}

	private updateAnswerSelected(answerId: string, selected: boolean): void {
		this._selectedAnswerIds.update((currentAnswerIds) => {
			if (!selected) {
				return currentAnswerIds.filter((currentAnswerId) => currentAnswerId !== answerId);
			}

			if (!this.multiple()) {
				return [answerId];
			}

			return currentAnswerIds.includes(answerId) ? currentAnswerIds : [...currentAnswerIds, answerId];
		});
	}
}
