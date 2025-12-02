import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'legend[hlmFieldLegend]',
	host: {
		'data-slot': 'field-legend',
		'[attr.data-variant]': 'variant()',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldLegend {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly variant = input<'label' | 'legend'>('legend');

	protected readonly _computedClass = computed(() =>
		hlm('mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base', this.userClass()),
	);
}
