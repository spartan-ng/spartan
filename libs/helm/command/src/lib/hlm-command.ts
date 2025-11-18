import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCommand } from '@spartan-ng/brain/command';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-command',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnCommand,
			inputs: ['id', 'filter'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmCommand {
	/** The user defined class */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The styles to apply  */
	protected readonly _computedClass = computed(() =>
		hlm('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', this.userClass()),
	);
}
