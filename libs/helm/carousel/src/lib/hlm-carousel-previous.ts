import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { HlmCarousel } from './hlm-carousel';

@Component({
	selector: 'button[hlm-carousel-previous], button[hlmCarouselPrevious]',
	imports: [NgIcon],
	providers: [provideIcons({ lucideArrowLeft }), provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
	host: {
		'data-slot': 'carousel-previous',
		'[disabled]': 'isDisabled()',
		'(click)': '_carousel.scrollPrev()',
	},
	template: `
		<ng-icon name="lucideArrowLeft" class="rtl:rotate-180" />
		<span class="sr-only">Previous slide</span>
	`,
})
export class HlmCarouselPrevious {
	private readonly _button = inject(HlmButton);

	protected readonly _carousel = inject(HlmCarousel);

	private readonly _computedClass = computed(() =>
		hlm(
			'spartan-carousel-previous absolute h-8 w-8',
			this._carousel.orientation() === 'horizontal'
				? '-start-12 top-1/2 -translate-y-1/2'
				: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
		),
	);
	protected readonly isDisabled = () => !this._carousel.canScrollPrev();

	constructor() {
		effect(() => {
			const computedClass = this._computedClass();
			untracked(() => this._button.setClass(computedClass));
		});
	}
}
