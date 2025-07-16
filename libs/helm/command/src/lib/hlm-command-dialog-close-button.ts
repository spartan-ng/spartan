import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandDialogCloseBtn]',
	hostDirectives: [HlmButton, BrnDialogClose],
	providers: [provideBrnButtonConfig({ variant: 'ghost' }), provideHlmIconConfig({ size: 'xs' })],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDialogCloseButton {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'absolute top-3 right-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring font-medium h-10 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center px-4 py-2 ring-offset-background rounded-md text-sm transition-colors !h-5 !p-1 !w-5',
			this.userClass(),
		),
	);
}
