import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnMenuItem } from '@spartan-ng/brain/menu';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuBarItem]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnMenuItem],
})
export class HlmMenuBarItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'focus:bg-accent focus:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-none select-none',
			this.userClass(),
		),
	);
}
