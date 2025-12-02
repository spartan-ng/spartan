import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogFooter],hlm-alert-dialog-footer',
	host: {
		'data-slot': 'alert-dialog-footer',
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogFooter {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.userClass()),
	);
}
