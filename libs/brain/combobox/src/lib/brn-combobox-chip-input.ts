import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'input[brnComboboxChipInput]',
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
		'[attr.disabled]': '_disabled() ? "" : null',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput($event)',
	},
})
export class BrnComboboxChipInput<T> {
	private static _id = 0;
	private readonly _el = inject(ElementRef);
	private readonly _combobox = injectBrnComboboxBase<T>();

	/** The id of the combobox input */
	public readonly id = input<string>(`brn-combobox-input-${++BrnComboboxChipInput._id}`);

	protected readonly _disabled = this._combobox.disabledState;

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._combobox.isExpanded;

	constructor() {
		effect(() => {
			const search = this._combobox.search();

			if (search === '') {
				// reset input on popover close
				this._el.nativeElement.value = '';
			}
		});
	}

	protected onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;

		this._combobox.search.set(value);
		this._combobox.open();
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();

			this._combobox.selectActiveItem();
		}

		if (!this._isExpanded()) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				this._combobox.open();
			}

			if (event.key === 'Escape') {
				this._combobox.resetValue();
			}
		}

		if (this._combobox.search() === '' && event.key === 'Backspace') {
			this._combobox.removeLastSelectedItem();
		}

		this._combobox.keyManager.onKeydown(event);
	}
}
