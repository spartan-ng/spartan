import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandShortcut],hlm-command-shortcut',
	host: {
		'data-slot': 'command-shortcut',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandShortcut {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground ml-auto text-xs tracking-widest', this.userClass()),
	);
}
