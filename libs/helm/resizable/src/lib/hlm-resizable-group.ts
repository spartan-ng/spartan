import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnResizableGroup } from '@spartan-ng/brain/resizable';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-resizable-group',
	hostDirectives: [
		{
			directive: BrnResizableGroup,
			inputs: ['direction', 'layout'],
			outputs: ['dragEnd', 'dragStart', 'layoutChange'],
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
export class HlmResizableGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('group flex h-full w-full data-[panel-group-direction=vertical]:flex-col', this.userClass()),
	);
}
