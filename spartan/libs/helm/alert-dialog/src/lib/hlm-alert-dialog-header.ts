import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogHeader],hlm-alert-dialog-header',
	host: {
		'data-slot': 'alert-dialog-header',
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogHeader {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col gap-2 text-center sm:text-left', this.userClass()),
	);
}
