import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCallActions],hlm-tool-call-actions',
	exportAs: 'hlmToolCallActions',
	host: {
		'data-slot': 'tool-call-actions',
	},
})
export class HlmToolCallActions {
	constructor() {
		classes(() => 'spartan-tool-call-actions border-border/50 flex items-center justify-end gap-2 border-t p-3');
	}
}
