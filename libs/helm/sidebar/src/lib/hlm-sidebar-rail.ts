import { computed, Directive, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmSidebarService } from './hlm-sidebar.service';

@Directive({
	selector: 'button[hlmSidebarRail]',
	host: {
		'data-sidebar': 'rail',
		'data-slot': 'sidebar-rail',
		'[attr.aria-label]': 'ariaLabel()',
		tabindex: '-1',
		'[class]': '_computedClass()',
		'(click)': 'onClick()',
	},
})
export class HlmSidebarRail {
	private readonly _sidebarService = inject(HlmSidebarService);

	public readonly ariaLabel = input<string>('Toggle Sidebar', { alias: 'aria-label' });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
			'group-data-[side=left]:cursor-w-resize group-data-[side=right]:cursor-e-resize',
			'[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
			'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
			'[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
			'[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
			this.userClass(),
		),
	);

	protected onClick(): void {
		this._sidebarService.toggleSidebar();
	}
}
