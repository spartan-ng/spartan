import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandGroupLabel],hlm-command-group-label',
	host: {
		'data-slot': 'command-group-label',
		role: 'presentation',
	},
})
export class HlmCommandGroupLabel {
	constructor() {
		classes(() => 'text-muted-foreground block px-2 py-1.5 text-xs font-medium');
	}
}
