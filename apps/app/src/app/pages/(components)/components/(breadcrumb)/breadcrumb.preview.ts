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
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

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
					<a hlmBreadcrumbLink link="/home">Home</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-ellipsis class="h-4 w-4" [brnMenuTriggerFor]="breadcrumbDropdown" />
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
					<a hlmBreadcrumbLink hlmL link="/components">Components</a>
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

export const defaultCode = `
import { Component } from '@angular/core';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-preview',
	standalone: true,
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
	template: \`
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/home">Home</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-ellipsis class="h-4 w-4" [brnMenuTriggerFor]="breadcrumbDropdown" />
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
					<a hlmBreadcrumbLink hlmL link="/components">Components</a>
				</li>
				<li hlmBreadcrumbSeparator></li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</nav>
	\`,
})
export class BreadcrumbPreviewComponent {}
`;

export const defaultImports = `
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
`;

export const defaultSkeleton = `
<nav hlmBreadcrumb>
	<ol hlmBreadcrumbList>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink href="/home">Home</a>
		</li>
		<li hlmBreadcrumbSeparator></li>
		<li hlmBreadcrumbItem>
			<hlm-breadcrumb-ellipsis />
		</li>
		<li hlmBreadcrumbSeparator></li>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink hlmL href="/components">Components</a>
		</li>
		<li hlmBreadcrumbSeparator></li>
		<li hlmBreadcrumbItem>
			<span hlmBreadcrumbPage>Breadcrumb</span>
		</li>
	</ol>
</nav>
`;
