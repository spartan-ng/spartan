import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	imports: [HlmBreadCrumbImports, NgIcon, HlmIconImports, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	template: `
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/">Home</a>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon hlm size="sm" name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem>
					<button class="flex items-center gap-1" [hlmDropdownMenuTrigger]="breadcrumbDropdown">
						Components
						<ng-icon hlm size="sm" name="lucideChevronDown" />
					</button>
					<ng-template #breadcrumbDropdown>
						<hlm-dropdown-menu>
							<button hlmDropdownMenuItem id="document">
								<span>Documentation</span>
							</button>
							<button hlmDropdownMenuItem id="themes">
								<span>Themes</span>
							</button>
							<button hlmDropdownMenuItem id="github">
								<span>Github</span>
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon hlm size="sm" name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</nav>
	`,
})
export class BreadcrumbDropdown {}
