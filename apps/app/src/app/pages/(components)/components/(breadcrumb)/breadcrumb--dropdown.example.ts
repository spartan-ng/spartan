import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	imports: [
		HlmBreadcrumbDirective,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,
		NgIcon,
		HlmIconDirective,
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
				<li hlmBreadcrumbSeparator>
					<ng-icon hlm size="sm" name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
					<div class="flex items-center gap-1">
						Components
						<ng-icon hlm size="sm" name="lucideChevronDown" />
					</div>
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
export class BreadcrumbDropdownComponent {}

export const breadcrumbDropdownCode = `
import { Component } from '@angular/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	standalone: true,
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	imports: [
		HlmBreadcrumbDirective,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconDirective,
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
				<li hlmBreadcrumbSeparator>
						<ng-icon hlm size="sm" name="lucideSlash" />
				</li>
				<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
					<div class="flex items-center gap-1">
						Components
						<ng-icon hlm size="sm" name="lucideChevronDown" />
					</div>
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
	\`,
})
export class BreadcrumbDropdownComponent {}
`;

export const breadcrumbDropdownSkeleton = `
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

...

<nav hlmBreadcrumb>
	<ol hlmBreadcrumbList>
		<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
			<div class="flex items-center gap-1">
				Components
				<ng-icon hlm size="sm" name="lucideChevronDown" />
			</div>
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
	</ol>
</nav>
`;
