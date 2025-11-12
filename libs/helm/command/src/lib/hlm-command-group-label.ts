import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-command-group-label',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'presentation',
		'[class]': '_computedClass()',
	},
	template: '<ng-content />',
})
export class HlmCommandGroupLabel {
	/** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground px-2 py-1.5 text-xs font-medium', this.userClass()),
	);
}
