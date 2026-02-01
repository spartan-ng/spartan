import { computed, Directive } from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderRange]',
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline]': '_rangeInsetInline()',
	},
})
export class BrnSliderRange {
	protected readonly _slider = injectBrnSlider();

	protected readonly _rangeInsetInline = computed(() => {
		const thumbs = this._slider.thumbs();
		const inverted = this._slider.inverted();

		const start = thumbs[0].percentage();
		const end = thumbs[thumbs.length - 1].percentage();

		const inset = thumbs.length > 1 ? [`${start}%`, `${100 - end}%`] : ['0px', `${100 - start}%`];

		if (inverted) inset.reverse();

		return inset.join(' ');
	});
}
