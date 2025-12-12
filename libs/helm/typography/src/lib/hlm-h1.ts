import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmH1 = 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';

@Directive({
	selector: '[hlmH1]',
})
export class HlmH1 {
	constructor() {
		classes(() => hlmH1);
	}
}
