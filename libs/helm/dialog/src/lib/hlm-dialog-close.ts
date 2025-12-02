import { Directive, computed, input } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmDialogClose]',
	hostDirectives: [{ directive: BrnDialogClose, inputs: ['delay'] }],
	host: {
		'data-slot': 'dialog-close',
		'[class]': '_computedClass()',
	},
})
export class HlmDialogClose {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 flex items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none [&_ng-icon]:shrink-0',
			this.userClass(),
		),
	);
}
