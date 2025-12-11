import { computed, Directive, input } from '@angular/core';
import { BrnNavigationMenuList } from '@spartan-ng/brain/navigation-menu';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'ul[hlmNavigationMenuList]',
	hostDirectives: [
		{
			directive: BrnNavigationMenuList,
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmNavigationMenuList {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'group flex flex-1 list-none items-center justify-center gap-1',
			'data-[orientation=vertical]:flex-col',
			this.userClass(),
		),
	);
}
