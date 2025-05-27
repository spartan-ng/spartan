import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';

@Component({
	selector: 'hlm-command-search',
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	providers: [provideHlmIconConfig({ size: 'sm' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandSearchComponent {
	/*** The user defined class  */
	public readonly userClass = input<string>('', { alias: 'class' });

	/*** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('relative [&_ng-icon]:flex-none border-b border-border flex items-center px-3 space-x-2', this.userClass()),
	);
}
