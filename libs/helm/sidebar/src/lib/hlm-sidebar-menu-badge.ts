import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarMenuBadge]',

	host: {
		'data-sidebar': 'menu-badge',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuBadge implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums',
			'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
			'peer-data-[size=sm]/menu-button:top-1',
			'peer-data-[size=default]/menu-button:top-1.5',
			'peer-data-[size=lg]/menu-button:top-2.5',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarMenuBadge directive should only be used on <div> elements');
		}
	}
}
