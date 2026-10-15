import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({ selector: '[hlmTraceTitle],hlm-trace-title', host: { 'data-slot': 'trace-title' } })
export class HlmTraceTitle {
	constructor() {
		classes(() => 'spartan-trace-title motion-reduce:shimmer-none min-w-0 truncate');
	}
}
