import { Component, effect, signal } from '@angular/core';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-preview',
	imports: [HlmSliderImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<hlm-slider [(value)]="value" />
	`,
})
export class SliderPreview {
	public readonly value = signal([50, 20]);

	test = effect(() => {
		console.log(this.value());
	});
}

export const defaultImports = `
import { HlmSliderImports } from '@spartan-ng/helm/slider';
`;
export const defaultSkeleton = `
<hlm-slider />
`;
