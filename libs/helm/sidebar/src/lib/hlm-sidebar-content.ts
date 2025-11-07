import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSidebarContent],hlm-sidebar-content',
	host: {
		'data-slot': 'sidebar-content',
		'data-sidebar': 'content',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
			this.userClass(),
		),
	);
}
