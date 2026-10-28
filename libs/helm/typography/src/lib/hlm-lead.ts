import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmLead = 'text-xl text-muted-foreground';

@Directive({
	selector: '[hlmLead]',
	exportAs: 'hlmLead',
})
export class HlmLead {
	constructor() {
		classes(() => hlmLead);
	}
}
