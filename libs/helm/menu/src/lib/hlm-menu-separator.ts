import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuSeparator],hlm-menu-separator',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('bg-border -mx-1 my-1 block h-px', this.userClass()));
}
