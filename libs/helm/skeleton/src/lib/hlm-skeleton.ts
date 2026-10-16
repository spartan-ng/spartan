import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSkeleton],hlm-skeleton',
	exportAs: 'hlmSkeleton',
	host: {
		'data-slot': 'skeleton',
	},
})
export class HlmSkeleton {
	constructor() {
		classes(() => 'spartan-skeleton block motion-safe:animate-pulse');
	}
}
