import { computed, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';

import { HlmSidebarService } from './hlm-sidebar.service';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'main[hlmSidebarInset]', // Restrict to main elements only

	host: {
		'data-slot': 'sidebar-inset',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarInset implements OnInit {
	private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _sidebarService = inject(HlmSidebarService);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background relative flex w-full flex-1 flex-col',
			this._sidebarService.variant() === 'inset' &&
				'min-h-[calc(100svh-theme(spacing.4)))] md:m-2  md:rounded-xl md:shadow-sm',
			this._sidebarService.open() ? 'md:ml-0' : 'md:ml-2',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'main') {
			console.warn('hlmSidebarInset directive should only be used on <main> elements');
		}
	}
}
