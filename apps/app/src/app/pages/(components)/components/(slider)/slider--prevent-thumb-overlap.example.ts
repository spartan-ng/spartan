import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-prevent-thumb-overlap',
	imports: [HlmSliderImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<hlm-slider [(value)]="value" [step]="10" [minStepsBetweenThumbs]="1" />
	`,
})
export class SliderPreventThumbOverlap {
	public readonly value = signal([20, 50]);
}
