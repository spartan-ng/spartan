import { Directive } from '@angular/core';
import { BrnToolCallReject } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmToolCallReject],[hlmToolCallReject]',
	exportAs: 'hlmToolCallReject',
	hostDirectives: [
		{
			directive: BrnToolCallReject,
			inputs: ['reason'],
		},
	],
	host: {
		'data-slot': 'tool-call-reject',
	},
})
export class HlmToolCallReject {
	constructor() {
		classes(() => 'spartan-tool-call-reject');
	}
}
