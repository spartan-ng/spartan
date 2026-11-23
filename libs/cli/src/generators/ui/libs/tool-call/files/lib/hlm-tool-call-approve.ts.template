import { Directive } from '@angular/core';
import { BrnToolCallApprove } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmToolCallApprove],[hlmToolCallApprove]',
	exportAs: 'hlmToolCallApprove',
	hostDirectives: [
		{
			directive: BrnToolCallApprove,
		},
	],
	host: {
		'data-slot': 'tool-call-approve',
	},
})
export class HlmToolCallApprove {
	constructor() {
		classes(() => 'spartan-tool-call-approve');
	}
}
