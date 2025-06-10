import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmBreadcrumbPage]',
	host: {
		role: 'link',
		'[class]': '_computedClass()',
	},
})
export class HlmBreadcrumbPageDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('font-normal text-foreground', this.userClass()));
}
