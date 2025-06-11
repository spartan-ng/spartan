import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnTabsDirective } from '@spartan-ng/brain/tabs';

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
})
export class HlmTabsComponent {
	public readonly tab = input.required<string>();
}
