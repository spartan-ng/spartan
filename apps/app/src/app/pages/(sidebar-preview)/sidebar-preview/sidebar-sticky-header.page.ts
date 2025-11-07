import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './sticky-header/app-sidebar';
import { SiteHeader } from './sticky-header/site-header';

@Component({
	selector: 'spartan-sidebar-sticky-header',

	imports: [HlmSidebarImports, SiteHeader, AppSidebar],
	template: `
		<div hlmSidebarWrapper class="flex-col">
			<site-header />

			<div class="flex flex-1">
				<app-sidebar />
				<main hlmSidebarInset>
					<div class="flex flex-1 flex-col gap-4 p-4">
						<div class="grid auto-rows-min gap-4 md:grid-cols-3">
							<div class="bg-muted/50 aspect-video rounded-xl"></div>
							<div class="bg-muted/50 aspect-video rounded-xl"></div>
							<div class="bg-muted/50 aspect-video rounded-xl"></div>
						</div>
						<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
					</div>
				</main>
			</div>
		</div>
	`,
	host: {
		class: 'block [--header-height:--spacing(14)]',
	},
	styleUrl: 'sidebar-default.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export default class SidebarStickyHeaderPage {}
