import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { injectBrnSeparatorConfig, SeparatorOrientation } from './brn-separator.token';

@Directive({
	selector: '[brnSeparator],brn-separator',
	host: {
		'[role]': '_role()',
		'[attr.aria-orientation]': '_ariaOrientation()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnSeparator {
	private readonly _config = injectBrnSeparatorConfig();

	/** Orientation of the separator. */
	public readonly orientation = input<SeparatorOrientation>(this._config.orientation);
	/** Whether the separator is decorative. */
	public readonly decorative = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	protected readonly _role = computed(() => (this.decorative() ? 'none' : 'separator'));
	protected readonly _ariaOrientation = computed(() =>
		this.decorative() ? undefined : this.orientation() === 'vertical' ? 'vertical' : undefined,
	);
}
