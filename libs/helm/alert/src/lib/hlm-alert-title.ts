import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertTitle]',
})
export class HlmAlertTitle {
	constructor() {
		classes(() => 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight');
	}
}
