import { computed, Directive, input } from '@angular/core';
import { BrnCommand } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommand],hlm-command',
	hostDirectives: [
		{
			directive: BrnCommand,
			inputs: ['id', 'filter'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'data-slot': 'command',
		'[class]': '_computedClass()',
	},
})
export class HlmCommand {
	/** The user defined class */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', this.userClass()),
	);
}
