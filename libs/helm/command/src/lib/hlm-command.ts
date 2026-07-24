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
		classes(() => 'spartan-command flex size-full flex-col overflow-hidden');
	}
}
