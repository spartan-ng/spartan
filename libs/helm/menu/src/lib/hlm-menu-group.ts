import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnMenuGroup } from '@spartan-ng/brain/menu';

@Component({
	selector: 'hlm-menu-group',
	host: {
		class: 'block',
	},
	hostDirectives: [BrnMenuGroup],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />
	`,
})
export class HlmMenuGroup {}
