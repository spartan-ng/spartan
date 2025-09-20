import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import type { ClassValue } from 'clsx';

@Directive({
	selector: 'div[hlmSidebarFooter]',

	host: {
		'data-sidebar': 'footer',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarFooter {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex flex-col gap-2 p-2', this.userClass()));
}
