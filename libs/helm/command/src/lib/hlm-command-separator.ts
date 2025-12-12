import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandSeparator],hlm-command-separator',
	host: {
		'data-slot': 'command-separator',
		role: 'separator',
	},
})
export class HlmCommandSeparator {
	constructor() {
		classes(() => 'bg-border -mx-1 block h-px');
	}
}
