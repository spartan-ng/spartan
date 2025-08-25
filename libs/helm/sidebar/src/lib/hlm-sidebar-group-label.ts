import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarGroupLabel]',

	host: {
		'data-sidebar': 'group-label',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarGroupLabel implements OnInit {
	private readonly _element = inject<ElementRef<HTMLDivElement>>(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
			'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'div') {
			console.warn('hlmSidebarGroupLabel directive should only be used on <div> elements');
		}
	}
}
