import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { injectBrnQuestionnaireItem } from './brn-questionnaire.token';
import type { BrnQuestionnaireInputType } from './brn-questionnaire.types';
import { getAnswerKeyShortcuts, hasInputValue } from './brn-questionnaire.utils';

let nextInputId = 0;

@Directive({
	selector: 'input[brnQuestionnaireInput]',
	exportAs: 'brnQuestionnaireInput',
	host: {
		'[attr.id]': '_answerId',
		'[attr.name]': '_selected() ? _item.name() : null',
		'[attr.form]': '_selected() ? null : ""',
		'[attr.type]': 'type()',
		'[attr.disabled]': 'disabled() || null',
		'[attr.aria-invalid]': 'invalid() ? "true" : null',
		'[attr.aria-keyshortcuts]': '_ariaKeyShortcuts() ?? null',
		'[attr.data-filled]': 'filled() ? "" : null',
		'[attr.data-empty]': 'filled() ? null : ""',
		'(input)': 'onInput($event)',
		'(change)': 'onInput($event)',
	},
})
export class BrnQuestionnaireInput {
	protected readonly _item = injectBrnQuestionnaireItem();
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	protected readonly _answerId = `brn-questionnaire-input-${++nextInputId}`;

	public readonly type = input<BrnQuestionnaireInputType>('text');
	public readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
	public readonly value = input<string | undefined>(undefined);
	public readonly defaultValue = input<string | undefined>(undefined);

	private readonly _uncontrolledFilled = signal(hasInputValue(this.defaultValue()));

	public readonly disabled = computed(() => this._item.disabled() || this.disabledInput());
	public readonly invalid = computed(() => this._item.invalid());

	public readonly filled = computed(() => {
		const controlledValue = this.value();
		return controlledValue !== undefined ? hasInputValue(controlledValue) : this._uncontrolledFilled();
	});

	protected readonly _selected = computed(() => this._item.selectedAnswerIds().includes(this._answerId));

	protected readonly _ariaKeyShortcuts = computed(() =>
		getAnswerKeyShortcuts(null, !this.disabled() && this.filled() && this._selected()),
	);

	constructor() {
		effect((onCleanup) => {
			const defaultFilled = hasInputValue(this.defaultValue());
			this._uncontrolledFilled.set(defaultFilled);
			onCleanup(this._item.registerBoundAnswerDefault(this._answerId, defaultFilled));
		});

		effect((onCleanup) => {
			onCleanup(
				this._item.registerAnswerControl({
					disabled: this.disabled(),
					element: this._elementRef.nativeElement,
					id: this._answerId,
					type: 'input',
				}),
			);
		});

		effect(() => {
			const controlledValue = this.value();
			const resetVersion = this._item.resetVersion();

			if (controlledValue !== undefined) {
				this._item.syncControlledAnswerSelection(this._answerId, hasInputValue(controlledValue));
				const nextValue = String(controlledValue);
				this._elementRef.nativeElement.defaultValue = nextValue;
				this._elementRef.nativeElement.value = nextValue;
				return;
			}

			if (resetVersion > 0) {
				this._uncontrolledFilled.set(hasInputValue(this.defaultValue()));
			}
		});
	}

	protected onInput(event: Event): void {
		if (!(event.target instanceof HTMLInputElement)) {
			return;
		}

		if (this.value() !== undefined) {
			return;
		}

		const nextFilled = event.target.value.trim().length > 0;
		this._uncontrolledFilled.set(nextFilled);
		this._item.setAnswerSelectionFromInteraction(this._answerId, nextFilled);
	}
}
