import { Directive, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmBreadcrumbLink]',
	hostDirectives: [
		{
			directive: RouterLink,
			inputs: [
				'target',
				'queryParams',
				'fragment',
				'queryParamsHandling',
				'state',
				'info',
				'relativeTo',
				'preserveFragment',
				'skipLocationChange',
				'replaceUrl',
				'routerLink: link',
			],
		},
	],
})
export class HlmBreadcrumbLink {
	constructor() {
		classes(() => 'hover:text-foreground transition-colors');
	}

	/** The link to navigate to the page. */
	public readonly link = input<RouterLink['routerLink']>();
}
