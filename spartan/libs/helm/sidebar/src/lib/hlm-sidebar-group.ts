import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSidebarGroup],hlm-sidebar-group',
	host: {
		'data-slot': 'sidebar-group',
		'data-sidebar': 'group',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('relative flex w-full min-w-0 flex-col p-2', this.userClass()),
	);
}
