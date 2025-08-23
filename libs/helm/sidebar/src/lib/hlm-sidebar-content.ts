import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarContent]',

	host: {
		'data-sidebar': 'content',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarContent implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarContent directive should only be used on <div> elements');
		}
	}
}
