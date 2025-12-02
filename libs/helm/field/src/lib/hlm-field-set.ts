import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'fieldset[hlmFieldSet]',
	host: {
		'data-slot': 'field-set',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldSet {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'flex flex-col gap-6',
			'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
			this.userClass(),
		),
	);
}
