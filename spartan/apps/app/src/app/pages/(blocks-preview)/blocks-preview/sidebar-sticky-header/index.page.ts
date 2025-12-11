import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './sticky-header/app-sidebar';
import { SiteHeader } from './sticky-header/site-header';

@Component({
	selector: 'spartan-sidebar-sticky-header',
	imports: [HlmSidebarImports, SiteHeader, AppSidebar],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block [--header-height:--spacing(14)]',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<spartan-app-sidebar-sticky>
			<spartan-site-header-sticky header />
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
		</spartan-app-sidebar-sticky>
	`,
})
export default class SidebarStickyHeaderPage {}
