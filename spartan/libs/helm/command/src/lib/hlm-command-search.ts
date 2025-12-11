import { computed, Directive, input } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandSearch],hlm-command-search',
	providers: [provideHlmIconConfig({ size: 'sm' })],
	host: {
		'data-slot': 'command-search',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandSearch {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('flex h-9 items-center gap-2 border-b px-3 [&>_ng-icon]:flex-none [&>_ng-icon]:opacity-50', this.userClass()),
	);
}
