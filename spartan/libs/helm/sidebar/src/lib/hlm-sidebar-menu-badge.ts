import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSidebarMenuBadge],hlm-sidebar-menu-badge',
	host: {
		'data-slot': 'sidebar-menu-badge',
		'data-sidebar': 'menu-badge',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuBadge {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
			'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
			'peer-data-[size=sm]/menu-button:top-1',
			'peer-data-[size=default]/menu-button:top-1.5',
			'peer-data-[size=lg]/menu-button:top-2.5',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);
}
