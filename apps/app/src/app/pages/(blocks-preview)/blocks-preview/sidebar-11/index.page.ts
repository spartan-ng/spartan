import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar11 } from './sidebar-11/app-sidebar';
import { TreeItemComponent } from './sidebar-11/tree-item';

@Component({
	selector: 'spartan-sidebar-11-preview',
	imports: [HlmSidebarImports, AppSidebar11, HlmSeparatorImports, HlmBreadcrumbImports, TreeItemComponent],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-app-sidebar-11 />
			<main hlmSidebarInset>
				<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<button hlmSidebarTrigger class="-ml-1"></button>
					<hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<nav hlmBreadcrumb>
						<ol hlmBreadcrumbList>
							<li hlmBreadcrumbItem class="hidden md:block">
								<a hlmBreadcrumbLink href="#">components</a>
							</li>
							<li hlmBreadcrumbSeparator class="hidden md:block"></li>
							<li hlmBreadcrumbItem class="hidden md:block">
								<a hlmBreadcrumbLink href="#">ui</a>
							</li>
							<li hlmBreadcrumbSeparator class="hidden md:block"></li>
							<li hlmBreadcrumbItem>
								<a hlmBreadcrumbPage>button.tsx</a>
							</li>
						</ol>
					</nav>
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
		</div>
	`,
})
export default class Sidebar11Page {}
