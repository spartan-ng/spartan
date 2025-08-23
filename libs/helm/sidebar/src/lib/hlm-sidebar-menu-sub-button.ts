import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'a[hlmSidebarMenuSubButton]',

	host: {
		'data-sidebar': 'menu-sub-button',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuSubButton implements OnInit {
	private readonly _element = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

	public readonly size = input<'sm' | 'md'>('md');
	public readonly isActive = input<boolean>(false);
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground hover:cursor-pointer disabled:hover:cursor-default',
			'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
			this.size() === 'sm' && 'text-xs',
			this.size() === 'md' && 'text-sm',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'a') {
			console.warn('hlmSidebarMenuSubButton directive should only be used on <a> elements');
		}
	}
}
