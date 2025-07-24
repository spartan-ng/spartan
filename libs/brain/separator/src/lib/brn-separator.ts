import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type BrnSeparatorOrientation = 'horizontal' | 'vertical';

@Component({
	selector: 'brn-separator',
	template: '',
	host: {
		'[role]': '_role()',
		'[attr.aria-orientation]': '_ariaOrientation()',
		'[attr.data-orientation]': 'orientation()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSeparator {
	public readonly orientation = input<BrnSeparatorOrientation>('horizontal');
	public readonly decorative = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _role = computed(() => (this.decorative() ? 'none' : 'separator'));
	protected readonly _ariaOrientation = computed(() =>
		this.decorative() ? undefined : this.orientation() === 'vertical' ? 'vertical' : undefined,
	);
}
