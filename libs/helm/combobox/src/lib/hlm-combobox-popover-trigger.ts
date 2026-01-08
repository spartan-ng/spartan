import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[hlmComboboxPopoverTrigger]',
	host: {
		'(click)': 'open()',
	},
})
export class HlmComboboxPopoverTrigger {
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	open() {
		if (this.disabled()) return;

		this._brnDialog?.open();
	}
}
