import { Directive } from '@angular/core';
import { BrnToolCallTrigger } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmToolCallTrigger],[hlmToolCallTrigger]',
	exportAs: 'hlmToolCallTrigger',
	hostDirectives: [
		{
			directive: BrnToolCallTrigger,
		},
	],
	host: {
		'data-slot': 'tool-call-trigger',
	},
})
export class HlmToolCallTrigger {
	constructor() {
		classes(
			() =>
				'spartan-tool-call-trigger text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors',
		);
	}
}
