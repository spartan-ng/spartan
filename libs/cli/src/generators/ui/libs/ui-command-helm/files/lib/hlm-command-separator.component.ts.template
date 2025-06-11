import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	selector: 'hlm-command-separator',
	template: '',
	host: {
		role: 'separator',
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandSeparatorComponent {
	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() => hlm('h-px block w-full border-b border-border', this.userClass()));
}
