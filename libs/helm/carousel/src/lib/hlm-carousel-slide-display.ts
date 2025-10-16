import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmCarousel } from './hlm-carousel';

@Component({
	selector: 'hlm-carousel-slide-display',
	template: `
		<span class="sr-only">{{ _labelContent() }}</span>
		<div aria-hidden="true" [class]="slideClass()">{{ _currentSlide() }} / {{ _carousel.slideCount() }}</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCarouselSlideDisplay {
	protected readonly _carousel = inject(HlmCarousel);

	protected readonly _currentSlide = computed(() => this._carousel.currentSlide() + 1);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('', this.userClass()));

	public readonly slideClass = input<ClassValue>('text-muted-foreground text-sm');

	/** Screen reader only text for the slide display */
	public readonly label = input<string>('Slide');

	protected readonly _labelContent = computed(() => {
		const currentSlide = this._currentSlide();
		const slideCount = this._carousel.slideCount();
		return `${this.label()} ${currentSlide} of ${slideCount} is displayed`;
	});
}
