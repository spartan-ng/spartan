import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-breadcrumb-custom-separator',
	providers: [provideIcons({ lucideSlash })],
	imports: [
		HlmBreadcrumbDirective,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,
		NgIcon,
		HlmIconDirective,
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
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL link="/components">Components</a>
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
export class BreadcrumbCustomSeparatorComponent {}

export const breadcrumbCustomSeparatorCode = `
import { Component } from '@angular/core';
import { lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbDirective,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-breadcrumb-custom-separator',
	standalone: true,
	providers: [provideIcons({ lucideSlash })],
	imports: [
		HlmBreadcrumbDirective,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconDirective,
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
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL link="/components">Components</a>
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
export class BreadcrumbCustomSeparatorComponent {}
`;

export const breadcrumbCustomSeparatorSkeleton = `
import { lucideSlash } from '@ng-icons/lucide';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';

...

<nav hlmBreadcrumb>
	<ol hlmBreadcrumbList>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink link="/home">Home</a>
		</li>
		<li hlmBreadcrumbSeparator>
			<ng-icon hlm size="sm" name="lucideSlash" />
		</li>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink hlmL link="/components">Components</a>
		</li>
		<li hlmBreadcrumbSeparator>
				<ng-icon hlm size="sm" name="lucideSlash" />
		</li>
		<li hlmBreadcrumbItem>
			<span hlmBreadcrumbPage>Breadcrumb</span>
		</li>
	</ol>
</nav>
`;
