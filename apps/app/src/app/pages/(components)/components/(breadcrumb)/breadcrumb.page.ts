import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { BreadcrumbCollapsedComponent } from './breadcrumb--collapsed.example';
import { BreadcrumbCustomSeparatorComponent } from './breadcrumb--custom-separator.example';
import { BreadcrumbDropdownComponent } from './breadcrumb--dropdown.example';
import {
	breadcrumbCollapsedCode,
	breadcrumbCustomSeparatorCode,
	breadcrumbDropdownCode,
	defaultCode,
} from './breadcrumb.generated';
import { BreadcrumbPreviewComponent, defaultImports, defaultSkeleton } from './breadcrumb.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Breadcrumb', api: 'breadcrumb' },
	meta: metaWith('spartan/ui - Breadcrumb', 'Displays the path to the current resource using a hierarchy of links.'),
	title: 'spartan/ui - Breadcrumb',
};
@Component({
	selector: 'spartan-breadcrumb',
	imports: [
		UIApiDocsComponent,
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		CodePreviewDirective,
		TabsCliComponent,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		BreadcrumbPreviewComponent,
		BreadcrumbCustomSeparatorComponent,
		BreadcrumbDropdownComponent,
		BreadcrumbCollapsedComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Breadcrumb"
				lead="Displays the path to the current resource using a hierarchy of links."
			/>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui breadcrumb"
				ngCode="ng g @spartan-ng/cli:ui breadcrumb"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__custom-separator" class="${hlmH4} mt-6">Custom separator</h3>
			<p class="${hlmP} mb-2">
				Use a custom component as
				<code class="${hlmCode} mr-0.5">children</code>
				for
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbSeparator</code>
				to create a custom separator.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-custom-separator />
				</div>
				<spartan-code secondTab [code]="customSeparatorCode" />
			</spartan-tabs>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__dropdown" class="${hlmH4}">Dropdown</h3>
			<p class="${hlmP} mb-2">
				You can compose
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbItem</code>
				for
				<code class="${hlmCode} mr-0.5">HlmDropdownMenu</code>
				to create a custom separator.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-dropdown />
				</div>
				<spartan-code secondTab [code]="dropdownCode" />
			</spartan-tabs>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__collapsed" class="${hlmH4}">Collapsed</h3>
			<p class="${hlmP} mb-2">
				We provide a
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbEllipsisComponent</code>
				component to show a collapsed state when the breadcrumb is too long.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-collapsed />
				</div>
				<spartan-code secondTab [code]="collapsedCode" />
			</spartan-tabs>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="button" label="Button" />
				<spartan-page-bottom-nav-link direction="previous" href="badge" label="Badge" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BreadcrumbPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultImports = defaultImports;
	protected readonly defaultSkeleton = defaultSkeleton;

	protected readonly customSeparatorCode = breadcrumbCustomSeparatorCode;
	protected readonly dropdownCode = breadcrumbDropdownCode;
	protected readonly collapsedCode = breadcrumbCollapsedCode;
}
