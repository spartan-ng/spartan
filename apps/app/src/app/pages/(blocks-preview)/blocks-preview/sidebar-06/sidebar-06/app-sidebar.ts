import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryVerticalEnd } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMainDropdown } from './nav-main';
import { SidebarOptInForm } from './sidebar-opt-in-form';

@Component({
	selector: 'spartan-sidebar-06',
	imports: [HlmSidebarImports, NgIcon, NavMainDropdown, SidebarOptInForm],
	providers: [provideIcons({ lucideGalleryVerticalEnd })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-header>
				<ul hlmSidebarMenu>
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton size="lg" href="#">
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<ng-icon name="lucideGalleryVerticalEnd" class="text-base" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-medium">Documentation</span>
								<span>v1.0.0</span>
							</div>
						</a>
					</li>
				</ul>
			</hlm-sidebar-header>
			<hlm-sidebar-content>
				<spartan-nav-main-dropdown />
			</hlm-sidebar-content>
			<hlm-sidebar-footer>
				<div class="p-1">
					<spartan-sidebar-opt-in-form />
				</div>
			</hlm-sidebar-footer>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar06 {}
