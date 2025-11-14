import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommandList } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-command-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnCommandList,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: '<ng-content />',
})
export class HlmCommandList {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('max-h-[300px] overflow-x-hidden overflow-y-auto', this.userClass()),
	);
}
