import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCardFooter]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardFooter {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('[.border-t]:pt-6 flex items-center px-6', this.userClass()));
}
