import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmH3 = 'scroll-m-20 text-2xl font-semibold tracking-tight';

@Directive({
	selector: '[hlmH3]',
})
export class HlmH3 {
	constructor() {
		classes(() => hlmH3);
	}
}
