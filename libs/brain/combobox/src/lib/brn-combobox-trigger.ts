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
		'[attr.aria-invalid]': ' _ariaInvalid() ? "true": null',
		'[attr.data-invalid]': ' _ariaInvalid() ? "true": null',
		'[attr.data-matches-spartan-invalid]': ' _spartanInvalid() ? "true": null',
		'[attr.data-touched]': ' _touched() ? "true": null',
		'[attr.data-dirty]': ' _dirty() ? "true": null',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnComboboxTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _isExpanded = this._combobox.isExpanded;

	protected readonly _disabled = this._combobox.disabledState;

	protected readonly _isPlaceholder = computed(() => !this._combobox.hasValue());

	protected readonly _ariaInvalid = computed(() => this._combobox.controlState?.()?.invalid);
	protected readonly _dirty = computed(() => this._combobox.controlState?.()?.dirty);
	protected readonly _touched = computed(() => this._combobox.controlState?.()?.touched);
	protected readonly _spartanInvalid = computed(() => this._combobox.controlState?.()?.spartanInvalid);

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (!this._combobox.isExpanded() && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			this._combobox.open();
		}
	}
}
