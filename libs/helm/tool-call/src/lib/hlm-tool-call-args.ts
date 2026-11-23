import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmToolCallArgs],hlm-tool-call-args',
	exportAs: 'hlmToolCallArgs',
	host: {
		'data-slot': 'tool-call-args',
	},
})
export class HlmToolCallArgs {
	constructor() {
		classes(
			() =>
				'spartan-tool-call-args border-border/50 text-muted-foreground border-t px-3 py-2 text-xs group-data-[expanded=false]/tool-call:hidden',
		);
	}
}
