import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmFieldDescription]',
	host: {
		'data-slot': 'field-description',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'text-muted-foreground text-sm font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
			'nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
			this.userClass(),
		),
	);
}
