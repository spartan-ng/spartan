import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type BrnSeparatorOrientation = 'horizontal' | 'vertical';

@Component({
	selector: 'brn-separator',
	standalone: true,
	template: '',
	host: {
		'[role]': 'role()',
		'[attr.aria-orientation]': 'ariaOrientation()',
		'[attr.data-orientation]': 'orientation()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSeparatorComponent {
	public readonly orientation = input<BrnSeparatorOrientation>('horizontal');
	public readonly decorative = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly role = computed(() => (this.decorative() ? 'none' : 'separator'));
	protected readonly ariaOrientation = computed(() =>
		this.decorative() ? undefined : this.orientation() === 'vertical' ? 'vertical' : undefined,
	);
}
