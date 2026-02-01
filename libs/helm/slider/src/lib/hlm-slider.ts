import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSlider, BrnSliderImports, injectBrnSlider } from '@spartan-ng/brain/slider';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	imports: [BrnSliderImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSlider,
			inputs: ['value', 'disabled', 'min', 'max', 'step', 'inverted', 'showTicks', 'dirInput'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[dir]': '_slider.direction()',
	},
	template: `
		<div brnSliderTrack class="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full">
			<div class="bg-primary absolute h-full" brnSliderRange></div>
		</div>

		@if (_slider.showTicks()) {
			<div class="pointer-events-none absolute -inset-x-px top-2 h-1 w-full cursor-pointer transition-all">
				<div
					*brnSliderTick="let tick; let position = position"
					class="absolute size-1 rounded-full"
					[class.bg-secondary]="tick"
					[class.bg-primary]="!tick"
					[style.inset-inline-start.%]="position"
				></div>
			</div>
		}

		@for (i of _slider.thumbIndexes(); track i) {
			<span
				class="border-primary bg-background ring-ring/50 absolute block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				brnSliderThumb
			></span>
		}
	`,
})
export class HlmSlider {
	protected readonly _slider = injectBrnSlider();

	constructor() {
		classes(() => 'relative flex w-full touch-none items-center select-none');
	}
}
