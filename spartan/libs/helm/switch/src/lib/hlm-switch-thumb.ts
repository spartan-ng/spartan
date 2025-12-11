import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSwitchThumb {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background dark:group-data-[state=unchecked]:bg-foreground dark:group-data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform group-data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
			this.userClass(),
		),
	);
}
