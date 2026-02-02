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
			inputs: [
				'value',
				'disabled',
				'min',
				'max',
				'step',
				'minStepsBetweenThumbs',
				'inverted',
				'orientation',
				'showTicks',
				'dirInput',
			],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[dir]': '_slider.direction()',
	},
	template: `
		<div
			brnSliderTrack
			class="bg-muted relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
		>
			<div class="bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full" brnSliderRange></div>
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
				class="border-ring ring-ring/50 bg-primary absolute block size-3 shrink-0 rounded-full border transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-[3px] focus-visible:ring-[3px] focus-visible:outline-hidden active:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
				brnSliderThumb
			></span>
		}
	`,
})
export class HlmSlider {
	protected readonly _slider = injectBrnSlider();

	constructor() {
		classes(
			() =>
				'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
		);
	}
}
