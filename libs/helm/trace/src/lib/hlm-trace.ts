import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmTrace],hlm-trace',
	exportAs: 'hlmTrace',
	host: { 'data-slot': 'trace' },
})
export class HlmTrace {
	constructor() {
		classes(
			() =>
				'spartan-trace flex w-full min-w-0 flex-col *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:outline-none',
		);
	}
}
