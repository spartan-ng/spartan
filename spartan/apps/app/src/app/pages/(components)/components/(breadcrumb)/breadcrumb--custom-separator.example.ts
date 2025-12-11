import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
	selector: 'spartan-breadcrumb-custom-separator',
	imports: [HlmBreadCrumbImports, NgIcon],
	providers: [provideIcons({ lucideSlash })],
	template: `
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/">Home</a>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/components">Components</a>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</nav>
	`,
})
export class BreadcrumbCustomSeparator {}
