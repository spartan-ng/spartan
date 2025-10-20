import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { BreadcrumbCollapsed } from './breadcrumb--collapsed.example';
import { BreadcrumbCustomSeparator } from './breadcrumb--custom-separator.example';
import { BreadcrumbDropdown } from './breadcrumb--dropdown.example';
import { BreadcrumbPreview, defaultImports, defaultSkeleton } from './breadcrumb.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Breadcrumb', api: 'breadcrumb' },
	meta: metaWith('spartan/ui - Breadcrumb', 'Displays the path to the current resource using a hierarchy of links.'),
	title: 'spartan/ui - Breadcrumb',
};
@Component({
	selector: 'spartan-breadcrumb',

	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		CodePreview,
		TabsCli,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		BreadcrumbPreview,
		BreadcrumbCustomSeparator,
		BreadcrumbDropdown,
		BreadcrumbCollapsed,
		SectionSubSubHeading,
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
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui breadcrumb" ngCode="ng g @spartan-ng/cli:ui breadcrumb" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__custom-separator" spartanH4>Custom separator</h3>
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
				<spartan-code secondTab [code]="_customSeparatorCode()" />
			</spartan-tabs>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__dropdown" spartanH4>Dropdown</h3>
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
				<spartan-code secondTab [code]="_dropdownCode()" />
			</spartan-tabs>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__collapsed" spartanH4>Collapsed</h3>
			<p class="${hlmP} mb-2">
				We provide a
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbEllipsis</code>
				component to show a collapsed state when the breadcrumb is too long.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-collapsed />
				</div>
				<spartan-code secondTab [code]="_collapsedCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="button" label="Button" />
				<spartan-page-bottom-nav-link direction="previous" href="badge" label="Badge" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BreadcrumbPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('breadcrumb');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;

	protected readonly _customSeparatorCode = computed(() => this._snippets()['customSeparator']);
	protected readonly _dropdownCode = computed(() => this._snippets()['dropdown']);
	protected readonly _collapsedCode = computed(() => this._snippets()['collapsed']);
}
