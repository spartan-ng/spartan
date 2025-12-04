import { computed, Directive, input } from '@angular/core';
import { BrnTabs } from '@spartan-ng/brain/tabs';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabs],hlm-tabs',
	hostDirectives: [
		{
			directive: BrnTabs,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	host: {
		'data-slot': 'tabs',
		'[class]': '_computedClass()',
	},
})
export class HlmTabs {
	public readonly tab = input.required<string>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2', this.userClass()));
}
