import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({ selector: '[hlmCodeBlockFooter],hlm-code-block-footer', host: { 'data-slot': 'code-block-footer' } })
export class HlmCodeBlockFooter {
	constructor() {
		classes(() => 'spartan-code-block-footer flex min-w-0 shrink-0 items-center');
	}
}
