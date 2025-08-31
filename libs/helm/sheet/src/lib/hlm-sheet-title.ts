import { Directive, computed, input } from '@angular/core';
import { BrnSheetTitle } from '@spartan-ng/brain/sheet';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetTitle]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnSheetTitle],
})
export class HlmSheetTitle {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-foreground font-semibold', this.userClass()));
}
