import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmEmptyContent]',
	host: {
		'data-slot': 'empty-content',
		'[class]': '_computedClass()',
	},
})
export class HlmEmptyContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('text-balancet flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm', this.userClass()),
	);
}
