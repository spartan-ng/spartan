import { booleanAttribute, computed, Directive, effect, input, output, signal } from '@angular/core';
import { injectBrnQuestionnaireItem, provideBrnQuestionnaireChoice } from './brn-questionnaire.token';
import { getAnswerKeyShortcuts } from './brn-questionnaire.utils';

let nextChoiceId = 0;

@Directive({
	selector: 'label[brnQuestionnaireChoice]',
	exportAs: 'brnQuestionnaireChoice',
	providers: [provideBrnQuestionnaireChoice(BrnQuestionnaireChoice)],
	host: {
		'[attr.data-checked]': 'checked() ? "" : null',
		'[attr.data-unchecked]': 'checked() ? null : ""',
		'[attr.data-disabled]': 'disabled() ? "" : null',
		'[attr.data-invalid]': 'invalid() ? "" : null',
		'[attr.data-type]': 'type()',
		'[attr.data-shortcut]': 'shortcut() ?? null',
	},
})
export class BrnQuestionnaireChoice {
	private readonly _item = injectBrnQuestionnaireItem();
	private readonly _answerId = `brn-questionnaire-choice-${++nextChoiceId}`;

	public readonly value = input.required<string>();
	public readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
	public readonly defaultChecked = input(false, { transform: booleanAttribute });
	public readonly checkedInput = input<boolean | undefined>(undefined, { alias: 'checked' });

	public readonly checkedChange = output<Event>();

	private readonly _inputElement = signal<HTMLInputElement | null>(null);

	public readonly disabled = computed(() => this._item.disabled() || this.disabledInput());
	public readonly invalid = computed(() => this._item.invalid());
	public readonly type = computed(() => (this._item.multiple() ? 'checkbox' : 'radio'));

	public readonly checked = computed(() => {
		const controlledChecked = this.checkedInput();
		const selected = this._item.selectedAnswerIds().includes(this._answerId);

		if (controlledChecked !== undefined) {
			return this._item.status() === 'skipped' ? false : controlledChecked;
		}

		return selected;
	});

	public readonly shortcut = computed(
		() =>
			this._item.shortcutByChoiceValue()?.get(this.value()) ??
			this._item.shortcutByAnswerId().get(this._answerId) ??
			null,
	);

	public readonly inputId = computed(() => this._answerId);

	public readonly inputName = computed(() => (this._item.status() === 'skipped' ? undefined : this._item.name()));

	public readonly inputRequired = computed(
		() => this._item.required() && !this._item.multiple() && !this._item.hasInputAnswer(),
	);

	public readonly inputAriaKeyShortcuts = computed(() =>
		getAnswerKeyShortcuts(this.shortcut(), !this.disabled() && this.checked()),
	);

	constructor() {
		effect((onCleanup) => {
			onCleanup(this._item.registerBoundAnswerDefault(this._answerId, this.defaultChecked()));
		});

		effect((onCleanup) => {
			const inputElement = this._inputElement();

			if (!inputElement) {
				return;
			}

			onCleanup(
				this._item.registerAnswerControl({
					disabled: this.disabled(),
					element: inputElement,
					id: this._answerId,
					ownDisabled: this.disabledInput(),
					type: 'choice',
					value: this.value(),
				}),
			);
		});

		effect(() => {
			const controlledChecked = this.checkedInput();

			if (controlledChecked === undefined) {
				return;
			}

			this._item.resetVersion();
			this._item.syncControlledAnswerSelection(this._answerId, controlledChecked);
		});

		effect(() => {
			const inputElement = this._inputElement();

			if (!inputElement) {
				return;
			}

			const controlledChecked = this.checkedInput();
			inputElement.defaultChecked = controlledChecked !== undefined ? controlledChecked : this.defaultChecked();

			if (this._item.resetVersion() > 0) {
				inputElement.checked = this.checked();
			}
		});
	}

	public setInputElement(element: HTMLInputElement | null): void {
		this._inputElement.set(element);
	}

	public onInputChange(event: Event): void {
		this.checkedChange.emit(event);

		if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) {
			return;
		}

		const controlledChecked = this.checkedInput();

		if (controlledChecked === undefined) {
			this._item.setAnswerSelectionFromInteraction(this._answerId, event.target.checked);
			return;
		}

		if (this._item.status() === 'skipped' && controlledChecked === event.target.checked) {
			this._item.setAnswerSelectionFromInteraction(this._answerId, controlledChecked);
		}
	}
}
