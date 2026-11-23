import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCallHeader],hlm-tool-call-header',
	exportAs: 'hlmToolCallHeader',
	host: {
		'data-slot': 'tool-call-header',
	},
})
export class HlmToolCallHeader {
	constructor() {
		classes(() => 'spartan-tool-call-header flex items-center justify-between gap-2 p-3 font-medium');
	}
}
