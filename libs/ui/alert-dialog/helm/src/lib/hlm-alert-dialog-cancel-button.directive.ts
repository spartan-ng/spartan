import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/ui-button-helm';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	providers: [provideBrnButtonConfig({ variant: 'outline' })],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogCancelButtonDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('mt-2 sm:mt-0', this.userClass()));
}
