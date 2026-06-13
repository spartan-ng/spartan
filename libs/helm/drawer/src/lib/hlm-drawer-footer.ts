import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerFooter],hlm-drawer-footer',
	host: { 'data-slot': 'drawer-footer' },
})
export class HlmDrawerFooter {
	constructor() {
		classes(() => 'spartan-drawer-footer mt-auto flex flex-col');
	}
}
