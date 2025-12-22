import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmH4 = 'scroll-m-20 text-xl font-semibold tracking-tight';

@Directive({
	selector: '[hlmH4]',
})
export class HlmH4 {
	constructor() {
		classes(() => hlmH4);
	}
}
