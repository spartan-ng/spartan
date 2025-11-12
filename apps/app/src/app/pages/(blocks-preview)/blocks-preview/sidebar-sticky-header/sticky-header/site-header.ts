import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-site-header-sticky',
	imports: [HlmSidebarImports, HlmSeparatorImports, HlmBreadCrumbImports, HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<header class="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div class="flex h-(--header-height) w-full items-center gap-2 px-4">
				<button hlmSidebarTrigger></button>
				<hlm-separator orientation="vertical" class="mr-2" />
				<nav hlmBreadcrumb class="hidden sm:block">
					<ol hlmBreadcrumbList>
						<li hlmBreadcrumbItem>
							<a hlmBreadcrumbLink link="/">Building Your Application</a>
						</li>
						<li hlmBreadcrumbSeparator></li>
						<li hlmBreadcrumbItem>
							<a hlmBreadcrumbPage>Data Fetching</a>
						</li>
					</ol>
				</nav>

				<div hlmInputGroup class="w-full sm:ml-auto sm:w-auto">
					<input hlmInputGroupInput placeholder="Type to search..." />
					<div hlmInputGroupAddon>
						<ng-icon name="lucideSearch" />
					</div>
				</div>
			</div>
		</header>
	`,
})
export class SiteHeader {}
