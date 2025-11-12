import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-label',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-inset]': 'inset() ? "" : null',
	},
	template: `
		<ng-content />
	`,
})
export class HlmMenuLabel {
	public readonly inset = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('block px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', this.userClass()),
	);
}
