import { computed, Directive, input } from '@angular/core';
import { BrnCommandList } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandList],hlm-command-list',
	hostDirectives: [
		{
			directive: BrnCommandList,
			inputs: ['id'],
		},
	],
	host: {
		'data-slot': 'command-list',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandList {
	/** The user defined class  */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('max-h-[300px] overflow-x-hidden overflow-y-auto', this.userClass()),
	);
}
