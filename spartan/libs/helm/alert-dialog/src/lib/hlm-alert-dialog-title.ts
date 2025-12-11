import { Directive, computed, input } from '@angular/core';
import { BrnAlertDialogTitle } from '@spartan-ng/brain/alert-dialog';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogTitle]',
	hostDirectives: [BrnAlertDialogTitle],
	host: {
		'data-slot': 'alert-dialog-title',
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogTitle {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-lg font-semibold', this.userClass()));
}
