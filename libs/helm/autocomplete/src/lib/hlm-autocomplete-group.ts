import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteGroup } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-autocomplete-group',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnAutocompleteGroup,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: '<ng-content />',
})
export class HlmAutocompleteGroup {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('text-foreground block overflow-hidden p-1', this.userClass()),
	);
}
