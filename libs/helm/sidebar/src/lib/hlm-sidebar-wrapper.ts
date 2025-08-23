import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarWrapper]', // Restrict to main elements only

	host: {
		'data-slot': 'sidebar-wrapper',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarWrapper {
	private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', this.userClass()),
	);

	constructor() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarWrapper directive should only be used on <div> elements');
		}
	}
}
