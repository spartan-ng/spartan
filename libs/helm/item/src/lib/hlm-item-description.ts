import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'p[hlmItemDescription]',
	host: {
		'data-slot': 'item-description',
		'[class]': '_computedClass()',
	},
})
export class HlmItemDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
			this.userClass(),
		),
	);
}
