import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';

@Directive({
	selector: '[brnSeparator],brn-separator',
	host: {
		'[role]': '_role()',
		'[attr.aria-orientation]': '_ariaOrientation()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnSeparator {
	/** Orientation of the separator. */
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
	/** Whether the separator is decorative. */
	public readonly decorative = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	protected readonly _role = computed(() => (this.decorative() ? 'none' : 'separator'));
	protected readonly _ariaOrientation = computed(() =>
		this.decorative() ? undefined : this.orientation() === 'vertical' ? 'vertical' : undefined,
	);
}
