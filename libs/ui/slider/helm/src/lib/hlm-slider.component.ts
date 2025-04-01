import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
} from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import {
	BrnSliderDirective,
	BrnSliderRangeDirective,
	BrnSliderThumbDirective,
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
			inputs: ['value', 'disabled', 'min', 'max', 'step'],
			outputs: ['valueChange'],
		},
	],
	template: `
		<div brnSliderTrack class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
			<div class="bg-primary absolute h-full" brnSliderRange></div>
		</div>

		@if (showTicks()) {
			<div class="pointer-events-none absolute -inset-x-px top-2 h-1 w-full cursor-pointer transition-all">
				@for (tick of ticks(); track $index) {
					<div
						class="absolute size-1 rounded-full"
						[class.bg-secondary]="tick"
						[class.bg-primary]="!tick"
						[style.inset-inline-start.%]="($index / (ticks().length - 1)) * 100"
					></div>
				}
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
	imports: [BrnSliderThumbDirective, BrnSliderTrackDirective, BrnSliderRangeDirective],
})
export class HlmSliderComponent {
	private readonly _slider = injectBrnSlider();
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'w-full h-5 flex relative select-none items-center touch-none',
			this._slider.disabled() ? 'opacity-40' : '',
			this.userClass(),
		),
	);

	/** Whether we should show tick marks */
	public readonly showTicks = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly ticks = computed(() => {
		const value = this._slider.value();

		if (!this.showTicks()) {
			return [];
		}

		let numActive = Math.max(Math.floor((value - this._slider.min()) / this._slider.step()), 0);
		let numInactive = Math.max(Math.floor((this._slider.max() - value) / this._slider.step()), 0);

		const direction = getComputedStyle(this._elementRef.nativeElement).direction;

		direction === 'rtl' ? numInactive++ : numActive++;

		return Array(numActive).fill(true).concat(Array(numInactive).fill(false));
	});
}
