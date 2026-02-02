import { Directive } from '@angular/core';
import { BrnCommand } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommand],hlm-command',
	hostDirectives: [
		{
			directive: BrnCommand,
			inputs: ['id', 'filter', 'search', 'disabled'],
			outputs: ['valueChange', 'searchChange'],
		},
	],
	host: {
		'data-slot': 'command',
	},
})
export class HlmCommand {
	constructor() {
		classes(() => 'bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl p-1');
	}
}
