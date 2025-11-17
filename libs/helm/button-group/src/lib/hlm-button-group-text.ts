import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmButtonGroupText],hlm-button-group-text',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmButtonGroupText {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			"bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_ng-icon]:pointer-events-none [&_ng-icon:not([class*='text-'])]:text-base",
			this.userClass(),
		),
	);
}
