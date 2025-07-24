import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabs } from '@spartan-ng/brain/tabs';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-tabs',
	hostDirectives: [
		{
			directive: BrnTabs,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	template: '<ng-content/>',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabs {
	public readonly tab = input.required<string>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2', this.userClass()));
}
