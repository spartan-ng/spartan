import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	imports: [HlmBreadCrumbImports, NgIcon, HlmIconImports, BrnMenuImports, HlmMenuImports],
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
					<button class="flex items-center gap-1" [brnMenuTriggerFor]="breadcrumbDropdown">
						Components
						<ng-icon hlm size="sm" name="lucideChevronDown" />
					</button>
					<ng-template #breadcrumbDropdown>
						<hlm-menu>
							<button hlmMenuItem id="document">
								<span>Documentation</span>
							</button>
							<button hlmMenuItem id="themes">
								<span>Themes</span>
							</button>
							<button hlmMenuItem id="github">
								<span>Github</span>
							</button>
						</hlm-menu>
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
