import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmPaginationLink]',
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
		'data-slot': 'pagination-link',
		'[class]': '_computedClass()',
		'[attr.data-active]': 'isActive() ? "true" : null',
		'[attr.aria-current]': 'isActive() ? "page" : null',
	},
})
export class HlmPaginationLink {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	/** Whether the link is active (i.e., the current page). */
	public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	/** The size of the button. */
	public readonly size = input<ButtonVariants['size']>('icon');
	/** The link to navigate to the page. */
	public readonly link = input<RouterLink['routerLink']>();

	protected readonly _computedClass = computed(() =>
		hlm(
			'',
			this.link() === undefined ? 'cursor-pointer' : '',
			buttonVariants({
				variant: this.isActive() ? 'outline' : 'ghost',
				size: this.size(),
			}),
			this.userClass(),
		),
	);
}
