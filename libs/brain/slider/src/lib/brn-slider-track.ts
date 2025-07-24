import { Directive, ElementRef, HostListener, inject } from '@angular/core';
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

	@HostListener('mousedown', ['$event'])
	protected moveThumbToPoint(event: MouseEvent): void {
		if (this._slider.mutableDisabled()) {
			return;
		}

		const position = event.clientX;
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		const percentage = (position - rect.left) / rect.width;

		// update the value based on the position
		this._slider.setValue(this._slider.min() + (this._slider.max() - this._slider.min()) * percentage);
	}
}
