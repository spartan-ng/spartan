import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmSidebarGroupAction]',
	host: {
		'data-slot': 'sidebar-group-action',
		'data-sidebar': 'group-action',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroupAction {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 transition-transform outline-none hover:cursor-pointer focus-visible:ring-2 disabled:hover:cursor-default [&>_ng-icon]:size-4 [&>_ng-icon]:shrink-0',
			// Increases the hit area of the button on mobile.
			'after:absolute after:-inset-2 after:md:hidden',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);
}
