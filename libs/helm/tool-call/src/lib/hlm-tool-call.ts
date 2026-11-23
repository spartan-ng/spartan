import { Directive } from '@angular/core';
import { BrnToolCall } from '@spartan-ng/brain/tool-call';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCall],hlm-tool-call',
	exportAs: 'hlmToolCall',
	hostDirectives: [
		{
			directive: BrnToolCall,
			inputs: ['name', 'state', 'expanded'],
			outputs: ['approved', 'rejected', 'retried', 'expandedChange'],
		},
	],
	host: {
		'data-slot': 'tool-call',
	},
})
export class HlmToolCall {
	constructor() {
		classes(
			() =>
				'group/tool-call spartan-tool-call border-border bg-card text-card-foreground data-[state=error]:border-destructive/50 data-[state=error]:bg-destructive/5 relative flex w-full flex-col rounded-xl border shadow-xs transition-colors data-[state=denied]:opacity-70 data-[state=requires-approval]:border-amber-500/50 data-[state=requires-approval]:bg-amber-500/5',
		);
	}
}
