import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-vertical',
	imports: [HlmSliderImports],
	styles: `
		:host {
			display: flex;
			gap: 1.5rem;
		}
	`,
	template: `
		<hlm-slider [(value)]="value" orientation="vertical" />
		<hlm-slider [(value)]="value2" orientation="vertical" />
	`,
})
export class SliderVertical {
	public readonly value = signal([50]);
	public readonly value2 = signal([25]);
}
