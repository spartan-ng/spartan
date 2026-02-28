import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, contentChild, Directive, input } from '@angular/core';
import { BrnFieldControl } from './brn-field-control';

@Directive({
	selector: '[brnField],brn-field',
	host: {
		'[attr.data-invalid]': '_invalid() ? "true" : null',
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

		return control.errorState();
	});
}
