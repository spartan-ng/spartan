import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommandListDirective } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	selector: 'hlm-command-list',
	template: '<ng-content />',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [
		{
			directive: BrnCommandListDirective,
			inputs: ['id'],
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandListComponent {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', this.userClass()),
	);
}
