import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCardFooter]',
})
export class HlmCardFooter {
	constructor() {
		classes(() => 'flex items-center px-6 [.border-t]:pt-6');
	}
}
