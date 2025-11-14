import { Directive, computed, input } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandDialogCloseBtn]',
	providers: [provideBrnButtonConfig({ variant: 'ghost' }), provideHlmIconConfig({ size: 'xs' })],
	hostDirectives: [HlmButton, BrnDialogClose],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDialogCloseButton {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground ring-offset-background absolute top-3 right-3 inline-flex !h-5 h-10 !w-5 items-center justify-center rounded-md !p-1 px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
			this.userClass(),
		),
	);
}
