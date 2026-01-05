import { Directive } from '@angular/core';
import { BrnCommandGroup } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandGroup],hlm-command-group',
	hostDirectives: [
		{
			directive: BrnCommandGroup,
			inputs: ['id'],
		},
	],
	host: {
		'data-slot': 'command-group',
	},
})
export class HlmCommandGroup {
	constructor() {
		classes(() => 'text-foreground block overflow-hidden p-1 data-hidden:hidden');
	}
}
