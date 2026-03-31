import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { BrnComboboxContent } from './brn-combobox-content';
import { ComboboxInputMode, injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'input[brnComboboxInput]',
	exportAs: 'brnComboboxInput',
	host: {
		'[id]': 'id()',
		type: 'text',
		role: 'combobox',
		autocomplete: 'off',
		autocorrect: 'off',
		autocapitalize: 'none',
		spellcheck: 'false',
		'aria-autocomplete': 'list',
		'aria-haspopup': 'listbox',
		'[attr.aria-expanded]': '_isExpanded()',
		'[attr.aria-invalid]': '_ariaInvalid() ? "true": null',
		'[attr.data-invalid]': '_ariaInvalid() ? "true": null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true": null',
		'[attr.data-touched]': '_touched() ? "true": null',
		'[attr.data-dirty]': '_dirty() ? "true": null',
		'[attr.disabled]': 'disabled() ? "" : null',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput($event)',
	},
})
export class BrnComboboxInput<T> {
	private static _id = 0;
	private readonly _el = inject(ElementRef);
	private readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _content = inject(BrnComboboxContent, { optional: true });

	public readonly mode = computed<ComboboxInputMode>(() => (this._content ? 'popup' : 'combobox'));

	/** The id of the combobox input */
	public readonly id = input<string>(`brn-combobox-input-${++BrnComboboxInput._id}`);

	/** Manual override for aria-invalid. When not set, auto-detects from the parent combobox error state. */
	public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
		transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
		alias: 'aria-invalid',
	});

	public readonly disabled = this._combobox.disabledState;

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._combobox.isExpanded;

	/** Computed aria-invalid: uses manual override if provided, otherwise reads from parent error state. */
	protected readonly _ariaInvalid = computed(
		() => this.ariaInvalidOverride() ?? this._combobox.controlState?.()?.invalid,
	);

	protected readonly _dirty = computed(() => this._combobox.controlState?.()?.dirty);
	protected readonly _touched = computed(() => this._combobox.controlState?.()?.touched);
	protected readonly _spartanInvalid = computed(() => this._combobox.controlState?.()?.spartanInvalid);

	constructor() {
		this._combobox.registerComboboxInput?.(this);

		effect(() => {
			const mode = this.mode();
			const value = this._combobox.value();
			const search = this._combobox.search();

			// In combobox mode we want to display the label of the selected value if no search is active
			if (mode === 'combobox' && value && search === '') {
				this._el.nativeElement.value = stringifyAsLabel(value, this._combobox.itemToString());
				return;
			}

			// Otherwise we want to update the input value to the search value
			if (this._el.nativeElement.value !== search) {
				this._el.nativeElement.value = search;
			}
		});
	}

	protected onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;

		this._combobox.search.set(value);
		this._combobox.open();

		if (value === '' && this.mode() === 'combobox') {
			this._combobox.resetValue();
		}
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();

			this._combobox.selectActiveItem();
		}

		if (this._isExpanded()) {
			if (event.key === 'Tab') {
				this._combobox.selectActiveItem();
			}
		} else {
			if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				this._combobox.open();
			}

			if (event.key === 'Escape') {
				this._combobox.resetValue();
			}
		}

		this._combobox.keyManager.onKeydown(event);
	}
}
