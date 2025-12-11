import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmEmptyHeader],hlm-empty-header',
	host: {
		'data-slot': 'empty-header',
		'[class]': '_computedClass()',
	},
})
export class HlmEmptyHeader {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('flex max-w-sm flex-col items-center gap-2 text-center', this.userClass()),
	);
}
