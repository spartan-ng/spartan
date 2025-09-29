import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import type { ClassValue } from 'clsx';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'div[hlmSidebarMenuSkeleton]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (showIcon()) {
			<hlm-skeleton data-sidebar="menu-skeleton-icon" class="size-4 rounded-md" />
		} @else {
			<hlm-skeleton data-sidebar="menu-skeleton-text" class="h-4 max-w-[var(--skeleton-width)] flex-1" />
		}
	`,
	host: {
		'data-sidebar': 'menu-skeleton',
		'[class]': '_computedClass()',
		'[style.--skeleton-width]': '_width',
	},

	imports: [HlmSkeletonImports],
})
export class HlmSidebarMenuSkeleton {
	public readonly showIcon = input<boolean, boolean>(false, { transform: booleanAttribute });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex h-8 items-center gap-2 rounded-md px-2', this.userClass()),
	);
	protected readonly _width = `${Math.floor(Math.random() * 40) + 50}%`;
}
