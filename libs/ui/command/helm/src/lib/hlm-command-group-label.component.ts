import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

@Component({
	selector: 'hlm-command-group-label',
	template: '<ng-content />',
	host: {
		role: 'presentation',
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandGroupLabelComponent {
	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('font-medium px-2 py-1.5 text-muted-foreground text-xs', this.userClass()),
	);
}
