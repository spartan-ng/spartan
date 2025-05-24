import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommandGroupDirective } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	selector: 'hlm-command-group',
	template: '<ng-content />',
	hostDirectives: [
		{
			directive: BrnCommandGroupDirective,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandGroupComponent {
	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col overflow-hidden p-1 text-foreground data-[hidden]:hidden', this.userClass()),
	);
}
