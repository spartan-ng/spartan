import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmBreadcrumbItem]',
})
export class HlmBreadcrumbItem {
	constructor() {
		classes(() => 'inline-flex items-center gap-1.5');
	}
}
