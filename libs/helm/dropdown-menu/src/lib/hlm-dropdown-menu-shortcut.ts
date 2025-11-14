import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDropdownMenuShortcut],hlm-dropdown-menu-shortcut',
	host: {
		'data-slot': 'dropdown-menu-shortcut',
		'[class]': '_computedClass()',
	},
})
export class HlmDropdownMenuShortcut {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground ml-auto text-xs tracking-widest', this.userClass()),
	);
}
