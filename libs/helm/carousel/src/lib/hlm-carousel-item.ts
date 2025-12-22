import { Directive, inject } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmCarousel } from './hlm-carousel';

@Directive({
	selector: '[hlmCarouselItem],hlm-carousel-item',
	host: {
		'data-slot': 'carousel-item',
		role: 'group',
		'aria-roledescription': 'slide',
	},
})
export class HlmCarouselItem {
	private readonly _orientation = inject(HlmCarousel).orientation;

	constructor() {
		classes(() => ['min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'horizontal' ? 'pl-4' : 'pt-4']);
	}
}
