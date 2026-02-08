import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-disabled',
	imports: [HlmSliderImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<hlm-slider [(value)]="value" [disabled]="true" />
	`,
})
export class SliderDisabled {
	public readonly value = signal([50]);
}
