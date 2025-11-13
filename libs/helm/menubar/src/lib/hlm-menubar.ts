import { CdkMenuBar } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenubar],hlm-menubar',
	hostDirectives: [CdkMenuBar],
	host: {
		'data-slot': 'menubar',
		'[class]': '_computedClass()',
	},
})
export class HlmMenubar {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', this.userClass()),
	);
}
