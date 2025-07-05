import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsDirective } from '@spartan-ng/brain/tabs';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-tabs',
	hostDirectives: [
		{
			directive: BrnTabsDirective,
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
export class HlmTabsComponent {
	public readonly tab = input.required<string>();

	public readonly userClass = input<ClassValue>(
		'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
		{ alias: 'class' },
	);
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2', this.userClass()));
}
