import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmBreadcrumbItem]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBreadcrumbItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('inline-flex items-center gap-1.5', this.userClass()));
}
