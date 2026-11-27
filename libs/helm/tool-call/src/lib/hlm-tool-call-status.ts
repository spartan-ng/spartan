import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCallStatus],hlm-tool-call-status',
	exportAs: 'hlmToolCallStatus',
	host: {
		'data-slot': 'tool-call-status',
		role: 'status',
	},
})
export class HlmToolCallStatus {
	constructor() {
		classes(
			() =>
				'spartan-tool-call-status border-border text-muted-foreground group-data-[state=denied]/tool-call:text-muted-foreground group-data-[state=error]/tool-call:border-destructive/50 group-data-[state=error]/tool-call:text-destructive inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium group-data-[state=requires-approval]/tool-call:border-amber-500/50 group-data-[state=requires-approval]/tool-call:text-amber-600 dark:group-data-[state=requires-approval]/tool-call:text-amber-400',
		);
	}
}
