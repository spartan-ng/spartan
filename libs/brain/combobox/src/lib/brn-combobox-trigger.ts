import { computed, Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'button[brnComboboxTrigger]',
	host: {
		type: 'button',
		role: 'combobox',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': '_isExpanded() ? "true" : "false"',
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
		'[attr.disabled]': '_disabled() ? "" : null',
		'[attr.data-placeholder]': '_isPlaceholder() ? "" : null',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnComboboxTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _isExpanded = this._combobox.isExpanded;

	protected readonly _disabled = this._combobox.disabledState;

	protected readonly _isPlaceholder = computed(() => !this._combobox.hasValue());

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (!this._combobox.isExpanded() && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			this._combobox.open();
		}
	}
}
