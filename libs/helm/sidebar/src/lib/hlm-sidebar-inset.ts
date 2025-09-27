import { computed, Directive, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import { HlmSidebarService } from './hlm-sidebar.service';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'main[hlmSidebarInset]', // Restrict to main elements only

	host: {
		'data-slot': 'sidebar-inset',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarInset {
	private readonly _sidebarService = inject(HlmSidebarService);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background relative flex w-full flex-1 flex-col',
			this._sidebarService.variant() === 'inset' &&
				'min-h-[calc(100svh-theme(spacing.4)))] md:m-2 md:rounded-xl md:shadow-sm',
			this._sidebarService.open() ? 'md:ml-0' : 'md:ml-2',
			this.userClass(),
		),
	);
}
