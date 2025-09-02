import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ul[hlmSidebarMenu]',

	host: {
		'data-sidebar': 'menu',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenu implements OnInit {
	private readonly _element = inject(ElementRef<HTMLUListElement>);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex w-full min-w-0 flex-col gap-1', this.userClass()));

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'ul') {
			console.warn('hlm-sidebar-menu directive should be used on a <ul> element');
		}
	}
}
