import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteList } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-autocomplete-list',
	template: '<ng-content />',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [
		{
			directive: BrnAutocompleteList,
			inputs: ['id'],
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteList {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('block max-h-60 overflow-x-hidden overflow-y-auto', this.userClass()),
	);
}
