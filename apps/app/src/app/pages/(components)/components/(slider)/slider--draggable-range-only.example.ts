import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-draggable-range-only',
	imports: [HlmSliderImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<hlm-slider [(value)]="value" [draggableRange]="true" [draggableRangeOnly]="true" />
	`,
})
export class SliderDraggableRangeOnly {
	public readonly value = signal([25, 50]);
}
