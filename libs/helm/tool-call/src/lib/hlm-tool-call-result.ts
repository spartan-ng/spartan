import { Directive } from '@angular/core';
import { BrnToolCallPanel } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCallResult],hlm-tool-call-result',
	exportAs: 'hlmToolCallResult',
	hostDirectives: [BrnToolCallPanel],
	host: {
		'data-slot': 'tool-call-result',
	},
})
export class HlmToolCallResult {
	constructor() {
		classes(
			() =>
				'spartan-tool-call-result border-border/50 border-t p-3 text-sm group-data-[expanded=false]/tool-call:hidden',
		);
	}
}
