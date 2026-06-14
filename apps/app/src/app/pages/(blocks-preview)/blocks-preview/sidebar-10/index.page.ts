import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavActions } from '../shared/sidebar/nav-actions';
import { AppSidebar10 } from './sidebar-10/app-sidebar';
import { NavMainFlatItems } from './sidebar-10/nav-main-flat-items';

@Component({
	selector: 'spartan-sidebar-10-preview',
	imports: [HlmSidebarImports, AppSidebar10, HlmSeparatorImports, HlmBreadcrumbImports, NavActions, NavMainFlatItems],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-app-sidebar-10 />
			<main hlmSidebarInset>
				<header class="flex h-14 shrink-0 items-center gap-2">
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
					<div class="ml-auto px-3">
						<spartan-nav-actions />
					</div>
				</header>
				<div class="flex flex-1 flex-col gap-4 px-4 py-10">
					<div class="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl"></div>
					<div class="bg-muted/50 mx-auto h-full w-full max-w-3xl rounded-xl"></div>
				</div>
			</main>
		</div>
	`,
})
export default class Sidebar10Page {}
