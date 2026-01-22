import { Directive, effect, ElementRef, inject, input } from '@angular/core';
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

	public readonly disabled = this._autocomplete.disabledState;

	/** Whether the autocomplete panel is expanded */
	protected readonly _isExpanded = this._autocomplete.isExpanded;

	constructor() {
		effect(() => {
			const value = this._autocomplete.value();
			const search = this._autocomplete.search();

			const valueLabel = stringifyAsLabel(value, this._autocomplete.itemToString());

			if (valueLabel === search) {
				this._el.nativeElement.value = valueLabel;
			} else if (search === '') {
				this._el.nativeElement.value = '';
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

		if (!this._isExpanded()) {
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
