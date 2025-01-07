import { Directive, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BRN_SLIDER, BrnSliderTickMarkDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSliderTickMark]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[attr.dir]': '_direction()',
	},
	hostDirectives: [{ directive: BrnSliderTickMarkDirective, inputs: ['data'] }],
})
export class HlmSliderTickMarkDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly active = input<boolean>();

	protected _computedClass = computed(() =>
		hlm(
			'absolute w-1 h-1 top-0.5 rounded-full rtl:right-0',
			this.active() ? 'bg-secondary' : 'bg-primary',
			this.userClass(),
		),
	);
	protected _direction = computed(() => this._brnSlider.direction());

	private readonly _brnSlider = inject(BRN_SLIDER);
}
