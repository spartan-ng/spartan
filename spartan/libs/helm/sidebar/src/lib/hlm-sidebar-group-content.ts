import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarGroupContent]',
	host: {
		'data-slot': 'sidebar-group-content',
		'data-sidebar': 'group-content',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroupContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('w-full text-sm', this.userClass()));
}
