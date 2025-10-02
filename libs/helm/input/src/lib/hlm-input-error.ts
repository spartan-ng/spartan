import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmInputError]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputError {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-destructive text-sm font-medium', this.userClass()));
}
