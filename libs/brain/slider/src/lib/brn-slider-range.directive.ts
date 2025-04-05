import { Directive } from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderRange]',
	host: {
		'[attr.data-disabled]': 'slider.disabled()',
		'[style.width.%]': 'slider.percentage()',
	},
})
export class BrnSliderRangeDirective {
	/** Access the slider */
	protected readonly slider = injectBrnSlider();
}
