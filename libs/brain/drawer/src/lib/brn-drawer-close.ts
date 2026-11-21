import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnDrawerClose]',
	exportAs: 'brnDrawerClose',
	host: {
		'[disabled]': 'disabled()',
		'[attr.data-disabled]': 'disabled() ? "" : null',
	},
})
export class BrnDrawerClose extends BrnDialogClose {
	/** Whether the button is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
