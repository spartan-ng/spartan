import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmBreadcrumbList]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBreadcrumbList {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5', this.userClass()),
	);
}
