import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogTitle]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnDialogTitle],
})
export class HlmDialogTitle {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('text-lg font-semibold leading-none tracking-tight', this.userClass()),
	);
}
