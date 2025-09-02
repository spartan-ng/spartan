import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarFooter]',

	host: {
		'data-sidebar': 'footer',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarFooter implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2 p-2', this.userClass()));

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarFooter directive should only be used on <div> elements');
		}
	}
}
