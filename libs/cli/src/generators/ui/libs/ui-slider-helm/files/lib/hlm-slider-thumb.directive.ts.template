import { Directive, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BRN_SLIDER, BrnSliderThumbDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-slider-thumb, brn-slider-thumb [hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[attr.dir]': '_direction()',
	},
	hostDirectives: [BrnSliderThumbDirective],
})
export class HlmSliderThumbDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'-translate-y-1/2 h-5 w-5 absolute rounded-full top-1/2 ltr:left-0 rtl:right-0 bg-secondary border-2 border-black cursor-pointer pointer-events-none transition-all',
			this._brnSlider.brnSliderTrack()?.brnSliderInput()?.isFocused() ? 'ring-2 ring-gray-400' : '',
			this.userClass(),
		),
	);
	protected _direction = computed(() => this._brnSlider.direction());

	private readonly _brnSlider = inject(BRN_SLIDER);
}
