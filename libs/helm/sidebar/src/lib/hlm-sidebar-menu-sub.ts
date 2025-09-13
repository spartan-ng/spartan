import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ul[hlmSidebarMenuSub]',

	host: {
		'data-sidebar': 'menu-sub',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuSub implements OnInit {
	private readonly _element = inject<ElementRef<HTMLUListElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
			'group-data-[collapsible=icon]:hidden',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'ul') {
			console.warn('hlmSidebarMenuSub directive should only be used on <ul> elements');
		}
	}
}
