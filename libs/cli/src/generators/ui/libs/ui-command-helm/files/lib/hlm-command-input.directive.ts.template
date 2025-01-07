import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlm][brnCmdInput],[hlm][cmdkInput]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandInputDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected _computedClass = computed(() =>
		hlm(
			'h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			this.userClass(),
		),
	);
}
