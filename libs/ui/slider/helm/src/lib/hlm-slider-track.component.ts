import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BRN_SLIDER, BRN_SLIDER_TRACK, BrnSliderTrackDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';
import { HlmSliderTickMarkDirective } from './hlm-slider-tick-mark.directive';
import { HlmSliderTickMarksDirective } from './hlm-slider-tick-marks.directive';
import { HlmSliderTrackActiveFillDirective } from './hlm-slider-track-active-fill.directive';
import { HlmSliderTrackActiveDirective } from './hlm-slider-track-active.directive';
import { HlmSliderTrackInactiveDirective } from './hlm-slider-track-inactive.directive';

@Component({
	selector: 'hlm-slider-track, brn-slider-track [hlm]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content></ng-content>
		<div class="flex w-full flex-wrap">
			<div hlmSliderTrackInactive></div>
			<div hlmSliderTrackActive>
				<div hlmSliderTrackActiveFill></div>
			</div>
			@if (_brnSlider.showTickMarks()) {
				<div hlmSliderTickMarks>
					@for (tickMark of _brnSliderTrack.tickMarks(); track $index) {
						<div
							hlmSliderTickMark
							[data]="{ tickMarkIndex: $index, totalTickMarks: _brnSliderTrack.tickMarks().length }"
							[active]="tickMark"
						></div>
					}
				</div>
			}
		</div>
	`,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnSliderTrackDirective],
	imports: [
		HlmSliderTrackInactiveDirective,
		HlmSliderTrackActiveDirective,
		HlmSliderTrackActiveFillDirective,
		HlmSliderTickMarksDirective,
		HlmSliderTickMarkDirective,
	],
})
export class HlmSliderTrackComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('flex w-full h-2 px-3 self-center relative transition-all', this.userClass()),
	);

	protected readonly _brnSlider = inject(BRN_SLIDER);
	protected readonly _brnSliderTrack = inject(BRN_SLIDER_TRACK, { host: true });
}
