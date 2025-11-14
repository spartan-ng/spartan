import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnTabs } from '@spartan-ng/brain/tabs';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-tabs',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnTabs,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: '<ng-content/>',
})
export class HlmTabs {
	public readonly tab = input.required<string>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2', this.userClass()));
}
