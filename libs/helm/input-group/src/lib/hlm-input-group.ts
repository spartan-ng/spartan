import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, contentChild, Directive, inject, input } from '@angular/core';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputGroup],hlm-input-group',
	host: {
		'data-slot': 'input-group',
		role: 'group',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
	},
})
export class HlmInputGroup {
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });
	private readonly _fieldControlChild = contentChild(BrnFieldControl);

	/** Whether to force the input-group into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _spartanInvalid = computed(() => {
		if (this.forceInvalid()) return true;

		if (this._fieldControl) return this._fieldControl.spartanInvalid();

		return this._fieldControlChild()?.spartanInvalid();
	});

	constructor() {
		classes(
			() =>
				'group/input-group spartan-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
		);
	}
}
