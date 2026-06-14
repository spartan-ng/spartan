import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar12 } from './sidebar-12/app-sidebar';

@Component({
	selector: 'spartan-sidebar-12-preview',
	imports: [HlmSidebarImports, AppSidebar12, HlmSeparatorImports, HlmBreadcrumbImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-app-sidebar-12 />
			<main hlmSidebarInset>
				<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<button hlmSidebarTrigger class="-ml-1"></button>
					<hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<nav hlmBreadcrumb>
						<ol hlmBreadcrumbList>
							<li hlmBreadcrumbItem>
								<a hlmBreadcrumbPage>October 2024</a>
							</li>
						</ol>
					</nav>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="grid auto-rows-min gap-4 md:grid-cols-5">
						@for (i of calendarGrid; track i) {
							<div class="bg-muted/50 aspect-square rounded-xl"></div>
						}
					</div>
				</div>
			</main>
		</div>
	`,
})
export default class Sidebar12Page {
	public readonly calendarGrid = Array.from({ length: 20 });
}
