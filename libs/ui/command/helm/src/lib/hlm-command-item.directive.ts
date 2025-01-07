import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlm][brnCmdItem],[hlm][cmdkItem]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		// This is needed after changes to the underlying CMDK library used for the BrnCommand primitive
		// Ideally we would remove the dependency on this outside module. If you are open to that please
		// reach out and if you are feeling super ambitious you can implement it yourself and open a PR!
		'[style.display]': '"flex"',
	},
})
export class HlmCommandItemDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected _computedClass = computed(() =>
		hlm(
			'items-center relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none\n' +
				'aria-selected:bg-accent aria-selected:text-accent-foreground\n' +
				'hover:bg-accent/50\n' +
				'disabled:pointer-events-none disabled:opacity-50',
			this.userClass(),
		),
	);
}
