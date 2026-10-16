import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCodeBlockHeader],hlm-code-block-header',
	exportAs: 'hlmCodeBlockHeader',
	host: { 'data-slot': 'code-block-header' },
})
export class HlmCodeBlockHeader {
	constructor() {
		classes(
			() =>
				'spartan-code-block-header flex min-w-0 shrink-0 items-center *:has-[>[data-slot=code-block-title]]:min-w-0',
		);
	}
}
