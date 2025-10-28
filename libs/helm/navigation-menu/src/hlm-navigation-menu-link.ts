import { computed, Directive, input } from '@angular/core';
import { BrnNavigationMenuLink } from '@spartan-ng/brain/navigation-menu';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'a[hlmNavigationMenuLink]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [{ directive: BrnNavigationMenuLink, inputs: ['active'] }],
})
export class HlmNavigationMenuLink {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_ng-icon:not([class*="text-"])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_ng-icon:not([class*="size-"])]:size-4',
			'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
			this.userClass(),
		),
	);
}
