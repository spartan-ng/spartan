import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmFieldDescription],hlm-field-description',
	host: {
		'data-slot': 'field-description',
		'[class]': '_computedClass()',
	},
})
export class HlmFieldDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
			'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
			this.userClass(),
		),
	);
}
