import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import {
	BrnSliderDirective,
	BrnSliderRangeDirective,
	BrnSliderThumbDirective,
	BrnSliderTickDirective,
	BrnSliderTrackDirective,
	injectBrnSlider,
} from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSliderDirective,
			inputs: ['value', 'disabled', 'min', 'max', 'step', 'showTicks'],
			outputs: ['valueChange'],
		},
	],
	template: `
		<div brnSliderTrack class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
			<div class="bg-primary absolute h-full" brnSliderRange></div>
		</div>

		@if (slider.showTicks()) {
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

		<span
			class="border-primary bg-background ring-offset-background focus-visible:ring-ring absolute block h-5 w-5 -translate-x-1/2 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			brnSliderThumb
		></span>
	`,
	host: {
		'[class]': '_computedClass()',
	},
	imports: [BrnSliderThumbDirective, BrnSliderTrackDirective, BrnSliderRangeDirective, BrnSliderTickDirective],
})
export class HlmSliderComponent {
	protected readonly slider = injectBrnSlider();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'w-full h-5 flex relative select-none items-center touch-none',
			this.slider.disabled() ? 'opacity-40' : '',
			this.userClass(),
		),
	);
}
