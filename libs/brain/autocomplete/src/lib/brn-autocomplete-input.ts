import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({
	selector: 'input[brnAutocompleteInput]',
	exportAs: 'brnAutocompleteInput',
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
export class BrnAutocompleteInput<T> {
	private static _id = 0;
	private readonly _el = inject(ElementRef);
	private readonly _autocomplete = injectBrnAutocompleteBase<T>();

	/** The id of the autocomplete input */
	public readonly id = input<string>(`brn-autocomplete-input-${++BrnAutocompleteInput._id}`);

	/** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
	public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
		transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
		alias: 'aria-invalid',
	});

	public readonly disabled = this._autocomplete.disabledState;

	/** Whether the autocomplete panel is expanded */
	protected readonly _isExpanded = this._autocomplete.isExpanded;

	/** Computed aria-invalid: uses manual override if provided, otherwise reads from parent error state. */
	protected readonly _ariaInvalid = computed(
		() => this.ariaInvalidOverride() ?? this._autocomplete.controlState?.()?.invalid,
	);

	protected readonly _spartanInvalid = computed(() => this._autocomplete.controlState?.()?.spartanInvalid);
	protected readonly _touched = computed(() => this._autocomplete.controlState?.()?.touched);
	protected readonly _dirty = computed(() => this._autocomplete.controlState?.()?.dirty);

	constructor() {
		this._autocomplete.registerAutocompleteInput(this);

		effect(() => {
			const value = this._autocomplete.value();
			const valueLabel = stringifyAsLabel(value, this._autocomplete.itemToString());
			this._el.nativeElement.value = valueLabel ?? '';
		});

		effect(() => {
			const search = this._autocomplete.search();
			if (this._el.nativeElement.value !== search) {
				this._el.nativeElement.value = search;
			}
		});
	}

	protected onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;

		this._autocomplete.updateSearch(value);
	}

	protected onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();

			this._autocomplete.selectActiveItem();
		}

		if (this._isExpanded()) {
			if (event.key === 'Tab') {
				this._autocomplete.selectActiveItem();
			}
		} else {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				this._autocomplete.open();
			}

			if (event.key === 'Escape') {
				this._autocomplete.resetValue();
			}
		}

		this._autocomplete.keyManager.onKeydown(event);
	}
}
