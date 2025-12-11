import { computed, Directive, input } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandIcon]',
	providers: [provideHlmIconConfig({ size: 'sm' })],
	host: {
		'data-slot': 'command-icon',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandIcon {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground pointer-events-none shrink-0', this.userClass()),
	);
}
