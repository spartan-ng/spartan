import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'li[hlmSidebarMenuItem]',

	host: {
		'data-sidebar': 'menu-item',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuItem implements OnInit {
	private readonly _element = inject<ElementRef<HTMLLIElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('group/menu-item relative', this.userClass()));

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'li') {
			console.warn('hlmSidebarMenuItem directive should only be used on <li> elements');
		}
	}
}
