import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'cmdk-command[hlm],brn-cmd[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground',
			this.userClass(),
		),
	);
}
