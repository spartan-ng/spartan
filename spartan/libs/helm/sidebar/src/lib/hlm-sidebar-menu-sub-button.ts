import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'a[hlmSidebarMenuSubButton], button[hlmSidebarMenuSubButton]',
	host: {
		'data-slot': 'sidebar-menu-sub-button',
		'data-sidebar': 'menu-sub-button',
		'[attr.data-active]': 'isActive()',
		'[attr.data-size]': 'size()',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuSubButton {
	public readonly size = input<'sm' | 'md'>('md');
	public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>_ng-icon:not([class*='text-'])]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-none hover:cursor-pointer focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:cursor-default aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>_ng-icon]:size-4 [&>_ng-icon]:shrink-0 [&>span:last-child]:truncate`,
			'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
			'data-[size=md]:text-sm data-[size=sm]:text-xs',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);
}
