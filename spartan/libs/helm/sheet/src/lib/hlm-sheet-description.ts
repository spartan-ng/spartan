import { Directive, computed, input } from '@angular/core';
import { BrnSheetDescription } from '@spartan-ng/brain/sheet';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetDescription]',
	hostDirectives: [BrnSheetDescription],
	host: {
		'data-slot': 'sheet-description',
		'[class]': '_computedClass()',
	},
})
export class HlmSheetDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-muted-foreground text-sm', this.userClass()));
}
