import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmH2 =
	'scroll-m-20 border-border border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0';

@Directive({
	selector: '[hlmH2]',
})
export class HlmH2 {
	constructor() {
		classes(() => hlmH2);
	}
}
