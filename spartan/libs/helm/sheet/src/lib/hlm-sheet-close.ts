import { Directive, computed, input } from '@angular/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmSheetClose]',
	hostDirectives: [{ directive: BrnSheetClose, inputs: ['delay'] }],
	host: {
		'data-slot': 'sheet-close',
		'[class]': '_computedClass()',
	},
})
export class HlmSheetClose {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none',
			this.userClass(),
		),
	);
}
