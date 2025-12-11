import { computed, Directive, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmCarousel } from './hlm-carousel';

@Directive({
	selector: '[hlmCarouselContent],hlm-carousel-content',
	host: {
		'data-slot': 'carousel-content',
		'[class]': '_computedClass()',
	},
})
export class HlmCarouselContent {
	private readonly _orientation = inject(HlmCarousel).orientation;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex', this._orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', this.userClass()),
	);
}
