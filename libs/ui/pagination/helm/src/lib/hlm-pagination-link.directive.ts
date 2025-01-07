import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlm } from '@spartan-ng/brain/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/ui-button-helm';
import { type VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const paginationLinkVariants = cva('', {
	variants: {},
	defaultVariants: {},
});
export type PaginationLinkVariants = VariantProps<typeof paginationLinkVariants>;

@Directive({
	selector: '[hlmPaginationLink]',
	standalone: true,
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
		'[attr.aria-current]': 'isActive() ? "page" : null',
	},
})
export class HlmPaginationLinkDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly size = input<ButtonVariants['size']>('icon');
	public readonly link = input<RouterLink['routerLink']>();

	protected readonly _computedClass = computed(() =>
		hlm(
			paginationLinkVariants(),
			this.link() === undefined ? 'cursor-pointer' : '',
			buttonVariants({
				variant: this.isActive() ? 'outline' : 'ghost',
				size: this.size(),
			}),
			this.userClass(),
		),
	);
}
