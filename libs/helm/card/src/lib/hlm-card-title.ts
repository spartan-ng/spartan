import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCardTitle]',
})
export class HlmCardTitle {
	constructor() {
		classes(() => 'leading-none font-semibold');
	}
}
