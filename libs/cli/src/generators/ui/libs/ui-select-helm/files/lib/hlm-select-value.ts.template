import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
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
		hlm('line-clamp-1 flex items-center gap-2 data-[placeholder]:text-muted-foreground', this.userClass()),
	);
}
