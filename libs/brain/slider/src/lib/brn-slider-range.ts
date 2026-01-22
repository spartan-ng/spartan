import { Directive } from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

// '[style.width.%]': '_slider.percentage()',

@Directive({
	selector: '[brnSliderRange]',
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
	},
})
export class BrnSliderRange {
	/** Access the slider */
	protected readonly _slider = injectBrnSlider();
}
