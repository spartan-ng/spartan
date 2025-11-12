import { computed, Directive, input } from '@angular/core';
import { BrnMenuBar } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuBar],hlm-menu-bar',
	hostDirectives: [BrnMenuBar],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuBar {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', this.userClass()),
	);
}
