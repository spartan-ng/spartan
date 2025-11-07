import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

@Component({
	selector: 'app-sidebar',
	imports: [HlmSidebarImports, NavUser, NavSecondary],
	template: `
		<hlm-sidebar sidebarContainerClass="top-(--header-height) h-[calc(100svh-var(--header-height))]">
			<hlm-sidebar-header>
				<!-- TODO add logo -->
			</hlm-sidebar-header>

			<hlm-sidebar-content>
				<!-- TODO add main and project nav -->
				<nav-secondary class="mt-auto" />
			</hlm-sidebar-content>
			<hlm-sidebar-footer>
				<nav-user />
			</hlm-sidebar-footer>
		</hlm-sidebar>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebar {}
