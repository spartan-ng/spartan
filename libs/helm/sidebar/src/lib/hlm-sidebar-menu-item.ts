import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'li[hlmSidebarMenuItem]',
	host: {
		'data-slot': 'sidebar-menu-item',
		'data-sidebar': 'menu-item',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('group/menu-item relative', this.userClass()));
}
