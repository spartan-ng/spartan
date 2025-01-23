import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	standalone: true,
	selector: 'hlm-command-search',
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandSearchComponent {
	/*** The user defined class  */
	protected readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('[&_hlm-icon]:h-5 [&_hlm-icon]:w-5 border-b border-border flex items-center px-3 space-x-2', this.userClass()),
	);
}
