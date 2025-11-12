import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuLabel],hlm-menu-label',
	host: {
		'data-slot': 'dropdown-menu-label',
		'[class]': '_computedClass()',
		'[attr.data-inset]': 'inset() ? "" : null',
	},
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
