import { Directive, computed, input } from '@angular/core';
import { BrnAlertDialogDescriptionDirective } from '@spartan-ng/brain/alert-dialog';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogDescription]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAlertDialogDescriptionDirective],
})
export class HlmAlertDialogDescriptionDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-muted-foreground text-sm', this.userClass()));
}
