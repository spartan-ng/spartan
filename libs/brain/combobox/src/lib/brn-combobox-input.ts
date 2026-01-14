import { computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { BrnComboboxContent } from './brn-combobox-content';
import { injectBrnComboboxBase } from './brn-combobox.token';

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

	private readonly _mode = computed(() => (this._content ? 'popup' : 'combobox'));

	/** The id of the combobox input */
	public readonly id = input<string>(`brn-combobox-input-${++BrnComboboxInput._id}`);

	public readonly disabled = this._combobox.disabledState;

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._combobox.isExpanded;

	constructor() {
		effect(() => {
			const mode = this._mode();
			const value = this._combobox.value();
			const search = this._combobox.search();

			switch (mode) {
				case 'combobox':
					if (value && search === '') {
						this._el.nativeElement.value = stringifyAsLabel(value, this._combobox.itemToString());
					} else if (search === '') {
						this._el.nativeElement.value = '';
					}
					break;
				case 'popup':
					if (search === '') {
						this._el.nativeElement.value = '';
					}
					break;
			}
		});
	}

	protected onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;

		this._combobox.search.set(value);
		this._combobox.open();

		if (value === '' && this._mode() === 'combobox') {
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

		if (!this._isExpanded()) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				this._combobox.open();
			}

			if (event.key === 'Escape') {
				this._combobox.resetValue();
			}
		}

		this._combobox.keyManager.onKeydown(event);
	}
}
