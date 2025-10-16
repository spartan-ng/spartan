import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectValue {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('data-[placeholder]:text-muted-foreground line-clamp-1 flex items-center gap-2 truncate', this.userClass()),
	);
}
