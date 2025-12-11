import { Directive } from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderRange]',
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.width.%]': '_slider.percentage()',
	},
})
export class BrnSliderRange {
	/** Access the slider */
	protected readonly _slider = injectBrnSlider();
}
