import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmEmptyContent],hlm-empty-content',
	host: {
		'data-slot': 'empty-content',
		'[class]': '_computedClass()',
	},
})
export class HlmEmptyContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance', this.userClass()),
	);
}
