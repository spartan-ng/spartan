import { Directive, ElementRef, inject } from '@angular/core';
import { provideBrnSliderTrack } from './brn-slider-track.token';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderTrack]',
	providers: [provideBrnSliderTrack(BrnSliderTrack)],
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
	},
})
export class BrnSliderTrack {
	/** Access the slider */
	protected readonly _slider = injectBrnSlider();

	/** @internal Access the slider track */
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._slider.track.set(this);
	}
}
