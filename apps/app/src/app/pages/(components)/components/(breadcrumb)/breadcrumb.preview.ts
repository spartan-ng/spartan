import { Component } from '@angular/core';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import {
	HlmBreadcrumb,
	HlmBreadcrumbEllipsis,
	HlmBreadcrumbItem,
	HlmBreadcrumbLink,
	HlmBreadcrumbList,
	HlmBreadcrumbPage,
	HlmBreadcrumbSeparator,
} from '@spartan-ng/helm/breadcrumb';
import { HlmMenu, HlmMenuItem } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-breadcrumb-preview',
	imports: [
		HlmBreadcrumb,
		HlmBreadcrumbSeparator,
		HlmBreadcrumbEllipsis,
		HlmBreadcrumbList,
		HlmBreadcrumbItem,
		HlmBreadcrumbPage,
		HlmBreadcrumbLink,
		BrnMenuTrigger,
		HlmMenu,
		HlmMenuItem,
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
export class BreadcrumbPreview {}

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
