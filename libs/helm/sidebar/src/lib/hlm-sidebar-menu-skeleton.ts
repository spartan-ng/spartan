import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-sidebar-menu-skeleton,div[hlmSidebarMenuSkeleton]',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'sidebar-menu-skeleton',
		'data-sidebar': 'menu-skeleton',
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
	protected readonly _width = `${Math.floor(Math.random() * 40) + 50}%`;

	constructor() {
		classes(() => 'flex h-8 items-center gap-2 rounded-md px-2');
	}
}
