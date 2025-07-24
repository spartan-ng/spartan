import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { HlmCarousel } from './hlm-carousel';

@Component({
	selector: 'hlm-carousel-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmCarouselContent {
	private readonly _orientation = inject(HlmCarousel).orientation;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex', this._orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', this.userClass()),
	);
}
