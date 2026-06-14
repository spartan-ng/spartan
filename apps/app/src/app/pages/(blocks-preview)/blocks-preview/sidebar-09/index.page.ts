import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar09 } from './sidebar-09/app-sidebar';

@Component({
	selector: 'spartan-sidebar-09-preview',
	imports: [HlmSidebarImports, AppSidebar09, HlmSeparatorImports, HlmBreadcrumbImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block [--sidebar-width:350px]',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-app-sidebar-09 />
			<main hlmSidebarInset>
				<header class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
					<button hlmSidebarTrigger class="-ml-1"></button>
					<hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<nav hlmBreadcrumb>
						<ol hlmBreadcrumbList>
							<li hlmBreadcrumbItem class="hidden md:block">
								<a hlmBreadcrumbLink href="#">All Inboxes</a>
							</li>
							<li hlmBreadcrumbSeparator class="hidden md:block"></li>
							<li hlmBreadcrumbItem>
								<a hlmBreadcrumbPage>Inbox</a>
							</li>
						</ol>
					</nav>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					@for (i of rows; track i) {
						<div class="bg-muted/50 h-12 w-full rounded-lg"></div>
					}
				</div>
			</main>
		</div>
	`,
})
export default class Sidebar09Page {
	public readonly rows = Array.from({ length: 24 });
}
