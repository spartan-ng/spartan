import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ClassValue } from 'clsx';
import { HlmCarouselComponent } from './hlm-carousel.component';

@Component({
	selector: 'hlm-carousel-slide-display',
	template: `
		<span class="sr-only">{{ labelContent() }}</span>
		<div aria-hidden="true" class="text-muted-foreground text-sm">
			{{ currentSlide() }} / {{ carousel.slideCount() }}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCarouselSlideDisplayComponent {
	protected readonly carousel = inject(HlmCarouselComponent);

	protected readonly currentSlide = computed(() => this.carousel.currentSlide() + 1);

	public _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => this._userClass());

	public readonly label = input('Slide');

	protected readonly labelContent = computed(() => {
		const currentSlide = this.currentSlide();
		const slideCount = this.carousel.slideCount();
		return `${this.label()} ${currentSlide} of ${slideCount} is displayed`;
	});
}
