import { Component } from '@angular/core';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-breadcrumb-preview',
	imports: [HlmBreadCrumbImports, HlmDropdownMenuImports],
	template: `
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/">Home</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<button [hlmDropdownMenuTrigger]="breadcrumbDropdown">
						<hlm-breadcrumb-ellipsis class="size-4" />
						<span class="sr-only">Toggle menu</span>
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
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/components">Components</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</nav>
	`,
})
export class BreadcrumbPreview {}

export const defaultImports = `
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
`;

export const defaultSkeleton = `
<nav hlmBreadcrumb>
  <ol hlmBreadcrumbList>
    <li hlmBreadcrumbItem>
      <a hlmBreadcrumbLink link="/">Home</a>
    </li>
    <li hlmBreadcrumbSeparator></li>
    <li hlmBreadcrumbItem>
      <hlm-breadcrumb-ellipsis />
    </li>
    <li hlmBreadcrumbSeparator></li>
    <li hlmBreadcrumbItem>
      <a hlmBreadcrumbLink link="/components">Components</a>
    </li>
    <li hlmBreadcrumbSeparator></li>
    <li hlmBreadcrumbItem>
      <span hlmBreadcrumbPage>Breadcrumb</span>
    </li>
  </ol>
</nav>
`;
