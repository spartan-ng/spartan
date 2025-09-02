import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarGroup]',

	host: {
		'data-sidebar': 'group',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroup implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('relative flex w-full min-w-0 flex-col p-2', this.userClass()),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarGroup directive should only be used on <div> elements');
		}
	}
}
