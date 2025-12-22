import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteEmpty]',
})
export class HlmAutocompleteEmpty {
	constructor() {
		classes(() => 'py-6 text-center text-sm');
	}
}
