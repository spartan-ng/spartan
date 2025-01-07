import { Directive, computed, input } from '@angular/core';
import { BrnAlertDialogTitleDirective } from '@spartan-ng/brain/alert-dialog';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAlertDialogTitleDirective],
})
export class HlmAlertDialogTitleDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-lg font-semibold', this.userClass()));
}
