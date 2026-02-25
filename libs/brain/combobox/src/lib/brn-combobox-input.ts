import { computed, Directive, effect, ElementRef, inject, input, booleanAttribute } from '@angular/core';
import type { BooleanInput } from '@angular/cdk/coercion';
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
		'[attr.disabled]': 'disabled() ? "" : null',
		'[attr.placeholder]': '_combobox.placeholder()',
		'[readonly]': 'readonly()',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput($event)',
	},
})
export class BrnComboboxInput<T> {
	private static _id = 0;
	private readonly _el = inject(ElementRef);
	protected readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _content = inject(BrnComboboxContent, { optional: true });

	public readonly mode = computed<ComboboxInputMode>(() => (this._content ? 'popup' : 'combobox'));

	/** The id of the combobox input */
	public readonly id = input<string>(`brn-combobox-input-${++BrnComboboxInput._id}`);

	public readonly disabled = this._combobox.disabledState;

	/** Whether the combobox is readonly */
	public readonly readonly = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._combobox.isExpanded;

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

		effect(() => {
			if (this.readonly()) {
				this._combobox.keyManager.withTypeAhead(200);
			} else {
				this._combobox.keyManager.withTypeAhead(0); // Assuming 0 or nothing disables it, but actually, if it's not readonly, we don't typeahead
			}
		});
	}

	protected onInput(event: Event) {
		if (this.readonly()) return;

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
