import { Directive } from '@angular/core';
import { BrnToolCallRetry } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmToolCallRetry],[hlmToolCallRetry]',
	exportAs: 'hlmToolCallRetry',
	hostDirectives: [
		{
			directive: BrnToolCallRetry,
		},
	],
	host: {
		'data-slot': 'tool-call-retry',
	},
})
export class HlmToolCallRetry {
	constructor() {
		classes(() => 'spartan-tool-call-retry');
	}
}
