import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnMenu } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-sub-menu',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnMenu],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmSubMenu {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
			this.userClass(),
		),
	);
}
