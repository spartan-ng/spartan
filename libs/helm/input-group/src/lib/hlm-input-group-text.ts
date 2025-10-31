import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'span[hlmInputGroupText]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputGroupText {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			`text-muted-foreground flex items-center gap-2 text-sm [&_ng-icon]:pointer-events-none [&_ng-icon:not([class*='text-'])]:text-base`,
			this.userClass(),
		),
	);
}
