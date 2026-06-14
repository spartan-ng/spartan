import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar14 } from './sidebar-14/app-sidebar';

@Component({
	selector: 'spartan-sidebar-14-preview',
	imports: [HlmSidebarImports, AppSidebar14, HlmBreadcrumbImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<main hlmSidebarInset class="flex flex-1 flex-col">
				<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<nav hlmBreadcrumb>
						<ol hlmBreadcrumbList>
							<li hlmBreadcrumbItem class="hidden md:block">
								<a hlmBreadcrumbLink href="#">Build Your Application</a>
							</li>
							<li hlmBreadcrumbSeparator class="hidden md:block"></li>
							<li hlmBreadcrumbItem>
								<a hlmBreadcrumbPage>Data Fetching</a>
							</li>
						</ol>
					</nav>
					<button hlmSidebarTrigger class="-mr-1 ml-auto rotate-180"></button>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
					</div>
					<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</main>
			<spartan-app-sidebar-14 />
		</div>
	`,
})
export default class Sidebar14Page {}
