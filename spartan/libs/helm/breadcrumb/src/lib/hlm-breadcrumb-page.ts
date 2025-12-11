import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmBreadcrumbPage]',
	host: {
		role: 'link',
		'aria-disabled': 'true',
		'aria-current': 'page',
		'[class]': '_computedClass()',
	},
})
export class HlmBreadcrumbPage {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('text-foreground font-normal', this.userClass()));
}
