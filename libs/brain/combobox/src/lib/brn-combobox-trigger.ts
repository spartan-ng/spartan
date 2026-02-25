import { Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'button[brnComboboxTrigger], input[brnComboboxTrigger], div[brnComboboxTrigger]',
	host: {
		type: 'button',
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
		'[attr.disabled]': '_disabled() ? "" : null',
		'(click)': 'toggle()',
	},
})
export class BrnComboboxTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _disabled = this._combobox.disabledState;

	public toggle(): void {
		if (this._disabled()) return;
		if (this._combobox.isExpanded()) {
			this._combobox.close();
		} else {
			this._combobox.open();
		}
	}
}
