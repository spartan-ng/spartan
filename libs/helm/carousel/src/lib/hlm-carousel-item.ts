import { computed, Directive, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmCarousel } from './hlm-carousel';

@Directive({
	selector: '[hlmCarouselItem],hlm-carousel-item',
	host: {
		'data-slot': 'carousel-item',
		'[class]': '_computedClass()',
		role: 'group',
		'aria-roledescription': 'slide',
	},
})
export class HlmCarouselItem {
	private readonly _orientation = inject(HlmCarousel).orientation;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'horizontal' ? 'pl-4' : 'pt-4', this.userClass()),
	);
}
