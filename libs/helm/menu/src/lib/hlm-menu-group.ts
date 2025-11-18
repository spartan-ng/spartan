import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnMenuGroup } from '@spartan-ng/brain/menu';

@Component({
	selector: 'hlm-menu-group',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnMenuGroup],
	host: {
		class: 'block',
	},
	template: `
		<ng-content />
	`,
})
export class HlmMenuGroup {}
