import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSliderInputDirective } from '@spartan-ng/brain/slider';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'input[hlmSliderInput], input[brnSliderInput]',
	standalone: true,
	hostDirectives: [BrnSliderInputDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderInputDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('w-full h-5 -top-1.5 left-0 opacity-0 absolute cursor-pointer transition-all', this.userClass()),
	);
}
