import { Directive, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BRN_SLIDER, BrnSliderTrackActiveFillDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSliderTrackActiveFill]',
	standalone: true,
	hostDirectives: [BrnSliderTrackActiveFillDirective],
	host: {
		'[class]': '_computedClass()',
		'[attr.dir]': '_direction()',
	},
})
export class HlmSliderTrackActiveFillDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'h-full w-full absolute top-0 pointer-events-none bg-primary ltr:origin-left rtl:origin-right transition-all scale-x-0',
			this.userClass(),
		),
	);
	protected _direction = computed(() => this._brnSlider.direction());

	private readonly _brnSlider = inject(BRN_SLIDER);
}
