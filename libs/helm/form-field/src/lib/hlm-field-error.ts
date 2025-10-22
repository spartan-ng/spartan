import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

// TODO merge HlmError into HlmFieldError
@Directive({
	selector: '[hlmFieldError],hlm-field-error',
	host: {
		role: 'alert',
		'data-slot': 'field-error',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldError {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('text-destructive text-sm font-normal', this.userClass()));
}
