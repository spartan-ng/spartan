import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDropdownMenuSeparator],hlm-dropdown-menu-separator',
	host: {
		'data-slot': 'dropdown-menu-separator',
		'[class]': '_computedClass()',
	},
})
export class HlmDropdownMenuSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('bg-border -mx-1 my-1 block h-px', this.userClass()));
}
