import { Directive } from '@angular/core';
import { BrnCommandList } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandList],hlm-command-list',
	hostDirectives: [
		{
			directive: BrnCommandList,
			inputs: ['id'],
		},
	],
	host: {
		'data-slot': 'command-list',
	},
})
export class HlmCommandList {
	constructor() {
		classes(() => 'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto');
	}
}
