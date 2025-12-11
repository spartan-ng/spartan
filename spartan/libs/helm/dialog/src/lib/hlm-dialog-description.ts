import { Directive, computed, input } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogDescription]',
	hostDirectives: [BrnDialogDescription],
	host: {
		'data-slot': 'dialog-description',
		'[class]': '_computedClass()',
	},
})
export class HlmDialogDescription {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-muted-foreground text-sm', this.userClass()));
}
