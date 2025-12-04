import { computed, Directive, input } from '@angular/core';
import { BrnResizablePanel } from '@spartan-ng/brain/resizable';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmResizablePanel],hlm-resizable-panel',
	hostDirectives: [
		{
			directive: BrnResizablePanel,
			inputs: ['defaultSize', 'id', 'collapsible', 'maxSize', 'minSize'],
		},
	],
	host: {
		'data-slot': 'resizable-panel',
		'[class]': '_computedClass()',
	},
})
export class HlmResizablePanel {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(this.userClass()));
}
