import { computed, Directive, input } from '@angular/core';
import { BrnMenuGroup } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuGroup],hlm-menu-group',
	hostDirectives: [BrnMenuGroup],
	host: {
		'data-slot': 'menu-group',
		'[class]': '_computedClass()',
	},
})
export class HlmMenuGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block', this.userClass()));
}
