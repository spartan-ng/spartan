import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmSmall = 'text-sm font-medium leading-none';

@Directive({
	selector: '[hlmSmall]',
})
export class HlmSmall {
	constructor() {
		classes(() => hlmSmall);
	}
}
