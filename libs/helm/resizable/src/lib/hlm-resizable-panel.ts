import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnResizablePanel } from '@spartan-ng/brain/resizable';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-resizable-panel',
	hostDirectives: [
		{
			directive: BrnResizablePanel,
			inputs: ['defaultSize', 'id', 'collapsible', 'maxSize', 'minSize'],
		},
	],
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmResizablePanel {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(this.userClass()));
}
