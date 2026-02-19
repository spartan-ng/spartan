import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { provideBrnRangeSliderTrack } from './brn-range-slider-track.token';
import { injectBrnRangeSlider } from './brn-range-slider.token';

@Directive({
	selector: '[brnRangeSliderTrack]',
	providers: [provideBrnRangeSliderTrack(BrnRangeSliderTrack)],
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
	},
})
export class BrnRangeSliderTrack {
	/** Access the range slider */
	protected readonly _slider = injectBrnRangeSlider();

	/** @internal Access the track element */
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this._slider.track.set(this);
	}

	/** Clicking the track moves the nearest thumb to the click position. */
	@HostListener('mousedown', ['$event'])
	protected moveThumbToPoint(event: MouseEvent): void {
		if (this._slider.mutableDisabled()) {
			return;
		}

		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		const clickValue = this._slider.min() + (this._slider.max() - this._slider.min()) * percentage;

		const thumb = this._slider.closestThumb(clickValue);
		this._slider.setThumbValue(thumb, clickValue);
	}
}
