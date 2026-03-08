import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, contentChild, Directive, input } from '@angular/core';
import { BrnFieldControl } from './brn-field-control';

@Directive({
	selector: '[brnField],brn-field',
	host: {
		'[attr.data-invalid]': '_invalid() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
	},
})
export class BrnField {
	private readonly _brnFieldControl = contentChild(BrnFieldControl);

	public readonly dataInvalid = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
		alias: 'data-invalid',
	});

	protected readonly _invalid = computed(() => {
		if (this.dataInvalid()) return true;

		const control = this._brnFieldControl();
		if (!control || !control.ngControl) return false;

		return control.controlState()?.invalid;
	});

	protected readonly _spartanInvalid = computed(() => {
		return this._brnFieldControl()?.controlState()?.spartanInvalid ?? null;
	});

	protected readonly _dirty = computed(() => {
		return this._brnFieldControl()?.controlState()?.dirty ?? null;
	});

	protected readonly _touched = computed(() => {
		return this._brnFieldControl()?.controlState()?.touched ?? null;
	});

	public readonly errors = computed(() => this._brnFieldControl()?.errors() ?? null);
	public readonly controlState = computed(() => this._brnFieldControl()?.controlState() ?? null);
}
