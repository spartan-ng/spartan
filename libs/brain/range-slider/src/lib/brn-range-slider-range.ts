import { Directive } from '@angular/core';
import { injectBrnRangeSlider } from './brn-range-slider.token';

@Directive({
	selector: '[brnRangeSliderRange]',
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.left.%]': '_slider.lowPercentage()',
		'[style.width.%]': '_slider.highPercentage() - _slider.lowPercentage()',
	},
})
export class BrnRangeSliderRange {
	/** Access the range slider */
	protected readonly _slider = injectBrnRangeSlider();
}
