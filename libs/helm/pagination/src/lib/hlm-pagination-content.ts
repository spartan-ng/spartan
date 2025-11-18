import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ul[hlmPaginationContent]',
	host: {
		'data-slot': 'pagination-content',
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-row items-center gap-1', this.userClass()));
}
