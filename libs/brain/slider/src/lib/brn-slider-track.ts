import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { provideBrnSliderTrack } from './brn-slider-track.token';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderTrack]',
	providers: [provideBrnSliderTrack(BrnSliderTrack)],
	host: {
		'[attr.data-disabled]': 'slider.disabled()',
	},
})
export class BrnSliderTrack {
	/** Access the slider */
	protected readonly slider = injectBrnSlider();

	/** @internal Access the slider track */
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		this.slider.track.set(this);
	}

	@HostListener('mousedown', ['$event'])
	protected moveThumbToPoint(event: MouseEvent): void {
		if (this.slider.disabled()) {
			return;
		}

		const position = event.clientX;
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		const percentage = (position - rect.left) / rect.width;

		// update the value based on the position
		this.slider.setValue(this.slider.min() + (this.slider.max() - this.slider.min()) * percentage);
	}
}
