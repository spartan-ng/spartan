import { Directive, computed, input } from '@angular/core';
import { BrnAlertDialogDescription } from '@spartan-ng/brain/alert-dialog';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogDescription]',
	hostDirectives: [BrnAlertDialogDescription],
	host: {
		'data-slot': 'alert-dialog-description',
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-muted-foreground text-sm', this.userClass()));
}
