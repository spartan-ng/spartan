import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmEmpty],hlm-empty',
	host: {
		'data-slot': 'empty',
	},
})
export class HlmEmpty {
	constructor() {
		classes(
			() =>
				'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
		);
	}
}
