import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { HlmCarousel } from './hlm-carousel';

@Component({
	selector: 'hlm-carousel-item',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
		role: 'group',
		'aria-roledescription': 'slide',
	},
	template: `
		<ng-content />
	`,
})
export class HlmCarouselItem {
	private readonly _orientation = inject(HlmCarousel).orientation;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'horizontal' ? 'pl-4' : 'pt-4', this.userClass()),
	);
}
