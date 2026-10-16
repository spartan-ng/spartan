import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({ selector: '[hlmSelectValuesContent],hlm-select-values-content', exportAs: 'hlmSelectValuesContent' })
export class HlmSelectValuesContent {
	constructor() {
		classes(() => 'spartan-select-values-content flex');
	}
}
