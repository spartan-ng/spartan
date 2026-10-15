import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({ selector: '[hlmTraceDescription],hlm-trace-description', host: { 'data-slot': 'trace-description' } })
export class HlmTraceDescription {
	constructor() {
		classes(() => 'spartan-trace-description text-muted-foreground/70 shrink-0 tabular-nums');
	}
}
