import { computed, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderRange]',
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled() ? "" : null',
		'[attr.data-orientation]': '_slider.orientation()',
		'[attr.data-draggable-range]': '_slider.isDraggableRange() ? "" : null',
		'data-slot': 'slider-range',
		'[style.inset-inline]': '_slider.isHorizontal() ? _rangeInset() : undefined',
		'[style.inset-block]': '!_slider.isHorizontal() ? _rangeInset() : undefined',
	},
})
export class BrnSliderRange {
	protected readonly _slider = injectBrnSlider();
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._slider.range.set(this);
	}

	protected readonly _rangeInset = computed(() => {
		const thumbs = this._slider.thumbs();
		if (!thumbs.length) return;

		const inverted = this._slider.inverted();
		const isHorizontal = this._slider.isHorizontal();

		const start = thumbs[0].percentage();
		const end = thumbs[thumbs.length - 1].percentage();

		const inset = thumbs.length > 1 ? [`${start}%`, `${100 - end}%`] : ['0px', `${100 - start}%`];

		if (!isHorizontal) {
			inset.reverse();
		}

		if (inverted) {
			inset.reverse();
		}

		return inset.join(' ');
	});
}
