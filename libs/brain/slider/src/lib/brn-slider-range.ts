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
	/** Access the slider */
	protected readonly _slider = injectBrnSlider();

	protected readonly _rangeInsetInline = computed(() => {
		const thumbs = this._slider.thumbs();

		if (thumbs.length > 1) {
			const startThumb = thumbs[0];
			const endThumb = thumbs[thumbs.length - 1];

			return `${startThumb._thumbOffset()} ${endThumb._thumbOffsetInverted()}`;
		} else {
			const startThumb = thumbs[0];

			return `0px ${startThumb._thumbOffsetInverted()}`;
		}
	});
}
