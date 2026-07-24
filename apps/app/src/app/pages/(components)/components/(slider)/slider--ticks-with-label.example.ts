import { Component, signal } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-ticks-with-label',
	imports: [HlmSliderImports, HlmLabel],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<div class="flex flex-col gap-2">
			<label hlmLabel for="volume">Volume</label>
			<hlm-slider id="volume" [(value)]="value" [showTicks]="true" />
		</div>
	`,
})
export class SliderTicksWithLabel {
	public readonly value = signal([50]);
}
