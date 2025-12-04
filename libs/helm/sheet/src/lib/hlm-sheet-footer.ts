import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetFooter],hlm-sheet-footer',
	host: {
		'data-slot': 'sheet-footer',
		'[class]': '_computedClass()',
	},
})
export class HlmSheetFooter {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('mt-auto flex flex-col gap-2 p-4', this.userClass()));
}
