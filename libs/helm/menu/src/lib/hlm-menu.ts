import { type NumberInput } from '@angular/cdk/coercion';
import { computed, Directive, input, numberAttribute } from '@angular/core';
import { BrnMenu } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenu],hlm-menu',
	hostDirectives: [BrnMenu],
	host: {
		'[class]': '_computedClass()',
		'[style.--side-offset]': 'sideOffset()',
	},
})
export class HlmMenu {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 my-[--spacing(var(--side-offset))] min-w-[8rem] origin-top overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
			this.userClass(),
		),
	);

	public readonly sideOffset = input<number, NumberInput>(1, { transform: numberAttribute });
}
