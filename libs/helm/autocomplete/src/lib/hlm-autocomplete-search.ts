import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-autocomplete-search',
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	providers: [provideHlmIconConfig({ size: 'sm' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteSearch {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-input focus-within:border-ring bg-background focus-within:ring-ring/50 dark:bg-input/30 flex h-9 min-w-0 items-center gap-2 rounded-md border px-3 shadow-xs focus-within:ring-[3px] [&>_ng-icon]:flex-none [&>_ng-icon]:opacity-50',
			this.userClass(),
		),
	);
}
