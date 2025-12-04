import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandEmpty]',
	host: {
		'data-slot': 'command-empty',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandEmpty {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('py-6 text-center text-sm', this.userClass()));
}
