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
		<div class="flex flex-col gap-5">
			<hlm-slider [(value)]="value" />
			<hlm-slider [(value)]="value2" dirInput="rtl" />
		</div>
	`,
})
export class SliderPreview {
	public readonly value = signal([50, 20]);
	public readonly value2 = signal([50, 20]);

	test = effect(() => {
		console.log('value 1', this.value());
	});

	test2 = effect(() => {
		console.log('value 2', this.value2());
	});
}

export const defaultImports = `
import { HlmSliderImports } from '@spartan-ng/helm/slider';
`;
export const defaultSkeleton = `
<hlm-slider />
`;
