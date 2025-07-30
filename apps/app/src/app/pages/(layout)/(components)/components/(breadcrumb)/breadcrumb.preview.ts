import { Component } from '@angular/core';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/helm/breadcrumb';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-breadcrumb-preview',
	imports: [
		HlmBreadcrumbDirective,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbEllipsisComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuItemDirective,
	],
	template: `
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/">Home</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<button [brnMenuTriggerFor]="breadcrumbDropdown">
						<hlm-breadcrumb-ellipsis class="size-4" />
						<span class="sr-only">Toggle menu</span>
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
export class BreadcrumbPreviewComponent {}

export const defaultImports = `
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/helm/breadcrumb';
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
