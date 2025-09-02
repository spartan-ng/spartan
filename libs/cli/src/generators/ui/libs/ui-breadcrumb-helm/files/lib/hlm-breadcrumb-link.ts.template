import { Directive, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

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
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBreadcrumbLink {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	/** The link to navigate to the page. */
	public readonly link = input<RouterLink['routerLink']>();

	protected readonly _computedClass = computed(() => hlm('hover:text-foreground transition-colors', this.userClass()));
}
