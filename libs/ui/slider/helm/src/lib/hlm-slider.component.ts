import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BRN_SLIDER, BrnSliderDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSliderDirective,
			inputs: ['brnSliderDisabled: disabled', 'min', 'max', 'step', 'dir', 'label', 'ariaLabel', 'showTickMarks'],
		},
	],
	template: '<ng-content/>',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('w-full h-5 flex relative', this._brnSlider.disabled() ? 'opacity-40' : '', this.userClass()),
	);

	private readonly _brnSlider = inject(BRN_SLIDER, { host: true });
}
