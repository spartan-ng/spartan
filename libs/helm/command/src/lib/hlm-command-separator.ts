import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandSeparator],hlm-command-separator',
	host: {
		'data-slot': 'command-separator',
		role: 'separator',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandSeparator {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() => hlm('bg-border -mx-1 block h-px', this.userClass()));
}
