import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmFieldTitle],hlm-field-title',
	host: {
		'data-slot': 'field-label',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldTitle {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
			this.userClass(),
		),
	);
}
