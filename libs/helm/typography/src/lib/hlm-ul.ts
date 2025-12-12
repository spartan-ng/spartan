import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmUl = 'my-6 ml-6 list-disc [&>li]:mt-2';

@Directive({
	selector: '[hlmUl]',
})
export class HlmUl {
	constructor() {
		classes(() => hlmUl);
	}
}
