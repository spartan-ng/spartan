import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-sidebar-menu-skeleton,div[hlmSidebarMenuSkeleton]',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'sidebar-menu-skeleton',
		'data-sidebar': 'menu-skeleton',
		'[class]': '_computedClass()',
		'[style.--skeleton-width]': '_width',
	},
	template: `
		@if (showIcon()) {
			<hlm-skeleton data-sidebar="menu-skeleton-icon" class="size-4 rounded-md" />
		} @else {
			<hlm-skeleton data-sidebar="menu-skeleton-text" class="h-4 max-w-[var(--skeleton-width)] flex-1" />
		}
	`,
})
export class HlmSidebarMenuSkeleton {
	public readonly showIcon = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex h-8 items-center gap-2 rounded-md px-2', this.userClass()),
	);
	protected readonly _width = `${Math.floor(Math.random() * 40) + 50}%`;
}
