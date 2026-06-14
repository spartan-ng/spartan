import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome, lucideInbox, lucideSearch, lucideSettings2 } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SidebarLeft } from './sidebar-15/sidebar-left';
import { SidebarRight } from './sidebar-15/sidebar-right';

@Component({
	selector: 'spartan-sidebar-15-preview',
	imports: [HlmSidebarImports, HlmSeparatorImports, HlmBreadcrumbImports, SidebarLeft, SidebarRight, NgIcon],
	providers: [provideIcons({ lucideSearch, lucideInbox, lucideHome, lucideSettings2 })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-sidebar-left />
			<main hlmSidebarInset>
				<header class="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
					<div class="flex flex-1 items-center gap-2 px-3">
						<button hlmSidebarTrigger></button>
						<hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
						<nav hlmBreadcrumb>
							<ol hlmBreadcrumbList>
								<li hlmBreadcrumbItem>
									<a hlmBreadcrumbPage class="line-clamp-1">Project Management & Task Tracking</a>
								</li>
							</ol>
						</nav>
					</div>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl"></div>
					<div class="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl"></div>
				</div>
			</main>
			<spartan-sidebar-right />
		</div>
	`,
})
export default class Sidebar15Page {}
