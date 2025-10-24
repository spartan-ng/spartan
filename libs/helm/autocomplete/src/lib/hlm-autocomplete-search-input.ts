import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteSearchInput } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'input[hlm-autocomplete-search-input]',
	template: '',
	hostDirectives: [{ directive: BrnAutocompleteSearchInput, inputs: ['value'], outputs: ['valueChange'] }],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteSearchInput {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'placeholder:text-muted-foreground flex h-full w-full bg-transparent py-1 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			this.userClass(),
		),
	);
}
