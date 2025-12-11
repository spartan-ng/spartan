import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'li[hlmSidebarMenuSubItem]',
	host: {
		'data-slot': 'sidebar-menu-sub-item',
		'data-sidebar': 'menu-sub-item',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuSubItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('group/menu-sub-item relative', this.userClass()));
}
