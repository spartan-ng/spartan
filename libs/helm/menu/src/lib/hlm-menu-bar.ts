import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnMenuBar } from '@spartan-ng/brain/menu';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-bar',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnMenuBar],
	template: '<ng-content/>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuBar {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', this.userClass()),
	);
}
