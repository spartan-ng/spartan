import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarGroupLabel], button[hlmSidebarGroupLabel]',
	host: {
		'data-slot': 'sidebar-group-label',
		'data-sidebar': 'group-label',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroupLabel {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opa] duration-200 ease-linear outline-none focus-visible:ring-2 [&>_ng-icon]:size-4 [&>_ng-icon]:shrink-0',
			'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
			this.userClass(),
		),
	);
}
