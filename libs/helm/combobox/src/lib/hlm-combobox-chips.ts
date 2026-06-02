import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { BrnComboboxAnchor, BrnComboboxPopoverTrigger, injectBrnComboboxBase } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxChips],hlm-combobox-chips',
	hostDirectives: [BrnComboboxAnchor, BrnComboboxPopoverTrigger],
	host: {
		'data-slot': 'combobox-chips',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
	},
})
export class HlmComboboxChips {
	private readonly _combobox = injectBrnComboboxBase();

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _spartanInvalid = computed(
		() => this.forceInvalid() || this._combobox.controlState?.()?.spartanInvalid,
	);

	constructor() {
		classes(() => 'spartan-combobox-chips');
	}
}
