import { Directive, computed, forwardRef, input } from '@angular/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { BrnSelect } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-select, brn-select [hlm]',
	host: {
		'[class]': '_computedClass()',
	},
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnSelect),
		},
	],
})
export class HlmSelect {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('space-y-2', this.userClass()));
}
