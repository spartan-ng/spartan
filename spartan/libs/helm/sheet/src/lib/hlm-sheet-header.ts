import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetHeader],hlm-sheet-header',
	host: {
		'data-slot': 'sheet-header',
		'[class]': '_computedClass()',
	},
})
export class HlmSheetHeader {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-1.5 p-4', this.userClass()));
}
