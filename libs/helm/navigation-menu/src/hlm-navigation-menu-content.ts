import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmNavigationMenuContent]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmNavigationMenuContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	// TODO: revise applied styles
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 left-0 top-0 w-full p-2 pr-2.5 md:w-auto',
			'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none top-full mt-1.5 overflow-hidden rounded-md border shadow !duration-200',
			this.userClass(),
		),
	);
}
