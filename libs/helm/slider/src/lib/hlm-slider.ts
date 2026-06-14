import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSlider, BrnSliderImports, injectBrnSlider } from '@spartan-ng/brain/slider';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	imports: [BrnSliderImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'slider',
	},
	hostDirectives: [
		{
			directive: BrnSlider,
			inputs: [
				'id',
				'value',
				'disabled',
				'min',
				'max',
				'step',
				'minStepsBetweenThumbs',
				'inverted',
				'orientation',
				'showTicks',
				'maxTicks',
				'tickLabelInterval',
				'formatTick',
				'draggableRange',
				'draggableRangeOnly',
				'aria-label',
				'aria-labelledby',
			],
			outputs: ['valueChange'],
		},
	],
	template: `
		<div class="relative flex w-full items-center group-data-vertical:w-auto group-data-vertical:flex-col">
			<div brnSliderTrack data-slot="slider-track" class="spartan-slider-track relative grow overflow-hidden">
				<div
					class="spartan-slider-range absolute select-none data-draggable-range:cursor-move data-horizontal:h-full data-vertical:w-full"
					brnSliderRange
					data-slot="slider-range"
				></div>
			</div>

			@for (i of _slider.thumbIndexes(); track i) {
				<span
					class="spartan-slider-thumb absolute block shrink-0 select-none after:absolute after:-inset-2"
					brnSliderThumb
					data-slot="slider-thumb"
				></span>
			}
		</div>

		@if (_slider.showTicks()) {
			<div
				class="spartan-slider-ticks text-muted-foreground mt-3 flex w-full items-start justify-between gap-1 text-xs font-medium group-data-horizontal:group-data-inverted:flex-row-reverse group-data-vertical:ms-3 group-data-vertical:mt-0 group-data-vertical:w-auto group-data-vertical:flex-col-reverse group-data-vertical:group-data-inverted:flex-col"
			>
				<div
					*brnSliderTick="let tick; let formattedTick = formattedTick"
					class="group flex w-0 flex-col items-center justify-center gap-2 group-data-vertical:h-0 group-data-vertical:w-auto group-data-vertical:flex-row"
				>
					<div
						class="bg-muted-foreground/70 h-1 w-px group-data-vertical:h-px group-data-vertical:w-1 group-data-horizontal:group-data-[skip]:h-0.5 group-data-vertical:group-data-[skip]:w-0.5"
					></div>
					<div class="text-center group-data-[skip]:opacity-0">{{ formattedTick }}</div>
				</div>
			</div>
		}
	`,
})
export class HlmSlider {
	protected readonly _slider = injectBrnSlider();

	constructor() {
		classes(() => [
			'group flex w-full touch-none flex-col select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-row data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		]);
	}
}
