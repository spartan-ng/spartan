import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandGroupLabel],hlm-command-group-label',
	host: {
		'data-slot': 'command-group-label',
		role: 'presentation',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandGroupLabel {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground px-2 py-1.5 text-xs font-medium', this.userClass()),
	);
}
