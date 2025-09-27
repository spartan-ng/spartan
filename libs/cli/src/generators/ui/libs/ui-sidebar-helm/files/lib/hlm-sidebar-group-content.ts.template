import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarGroupContent]',

	host: {
		'data-sidebar': 'group-content',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroupContent implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('w-full text-sm', this.userClass()));

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarGroupContent directive should only be used on <div> elements');
		}
	}
}
