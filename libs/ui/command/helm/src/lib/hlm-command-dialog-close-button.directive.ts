import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/ui-button-helm';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCmdDialogCloseBtn]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	providers: [provideBrnButtonConfig({ variant: 'ghost' })],
	host: {
		'[class]': 'computedClass()',
	},
})
export class HlmCommandDialogCloseButtonDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly computedClass = computed(() => hlm('!p-1 !h-5 !w-5', this.userClass()));
}
