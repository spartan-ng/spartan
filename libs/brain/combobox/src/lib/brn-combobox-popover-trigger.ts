import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPopoverTrigger]',
	host: {
		'[attr.aria-invalid]': 'applyControlState() && _ariaInvalid() ? "true": null',
		'[attr.data-invalid]': 'applyControlState() && _ariaInvalid() ? "true": null',
		'[attr.data-matches-spartan-invalid]': 'applyControlState() && _spartanInvalid() ? "true": null',
		'[attr.data-touched]': 'applyControlState() && _touched() ? "true": null',
		'[attr.data-dirty]': 'applyControlState() && _dirty() ? "true": null',
		'(click)': 'open()',
	},
})
export class BrnComboboxPopoverTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	/** When true, combobox trigger reflects the combobox form control state as data attributes (data-invalid, data-touched, etc.). */
	public readonly applyControlState = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected open() {
		if (this._combobox.disabledState()) return;

		this._brnDialog?.open();
	}

	protected readonly _ariaInvalid = computed(() => this._combobox.controlState?.()?.invalid);
	protected readonly _dirty = computed(() => this._combobox.controlState?.()?.dirty);
	protected readonly _touched = computed(() => this._combobox.controlState?.()?.touched);
	protected readonly _spartanInvalid = computed(() => this._combobox.controlState?.()?.spartanInvalid);
}
