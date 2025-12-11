import { computed, Directive, input } from '@angular/core';
import { BrnAutocompleteList } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAutocompleteList],hlm-autocomplete-list',
	hostDirectives: [
		{
			directive: BrnAutocompleteList,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAutocompleteList {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('block max-h-60 overflow-x-hidden overflow-y-auto', this.userClass()),
	);
}
