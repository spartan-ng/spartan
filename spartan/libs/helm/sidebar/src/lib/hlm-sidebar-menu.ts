import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ul[hlmSidebarMenu]',
	host: {
		'data-slot': 'sidebar-menu',
		'data-sidebar': 'menu',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenu {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex w-full min-w-0 flex-col gap-1', this.userClass()));
}
