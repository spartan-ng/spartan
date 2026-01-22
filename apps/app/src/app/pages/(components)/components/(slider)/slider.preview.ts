import { Component, effect, signal } from '@angular/core';
import { BrnSliderImports } from '@spartan-ng/brain/slider';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-preview',
	imports: [HlmSliderImports, BrnSliderImports],
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
	template: `
		<hlm-slider [(value)]="value">
			<div brnSliderTrack class="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full">
				<div class="bg-primary absolute h-full" brnSliderRange></div>
			</div>

			<!-- @if (_slider.showTicks()) {
				<div class="pointer-events-none absolute -inset-x-px top-2 h-1 w-full cursor-pointer transition-all">
					<div
						*brnSliderTick="let tick; let position = position"
						class="absolute size-1 rounded-full"
						[class.bg-secondary]="tick"
						[class.bg-primary]="!tick"
						[style.inset-inline-start.%]="position"
					></div>
				</div>
			} -->

			<span
				class="border-primary bg-background ring-ring/50 absolute block size-4 shrink-0 -translate-x-1/2 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				brnSliderThumb
			></span>
			<span
				class="border-primary ring-ring/50 absolute block size-4 shrink-0 -translate-x-1/2 rounded-full border bg-red-500 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				brnSliderThumb
			></span>
		</hlm-slider>
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
