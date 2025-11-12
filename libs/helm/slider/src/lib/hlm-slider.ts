import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
	BrnSlider,
	BrnSliderRange,
	BrnSliderThumb,
	BrnSliderTick,
	BrnSliderTrack,
	injectBrnSlider,
} from '@spartan-ng/brain/slider';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	imports: [BrnSliderThumb, BrnSliderTrack, BrnSliderRange, BrnSliderTick],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSlider,
			inputs: ['value', 'disabled', 'min', 'max', 'step', 'showTicks'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
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

		<span
			class="border-primary bg-background ring-ring/50 absolute block size-4 shrink-0 -translate-x-1/2 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			brnSliderThumb
		></span>
	`,
})
export class HlmSlider {
	protected readonly _slider = injectBrnSlider();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'relative flex w-full touch-none items-center select-none',
			this._slider.mutableDisabled() ? 'opacity-40' : '',
			this.userClass(),
		),
	);
}
