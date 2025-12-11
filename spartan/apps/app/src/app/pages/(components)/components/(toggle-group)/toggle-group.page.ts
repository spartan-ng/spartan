import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { Tabs } from '@spartan-ng/app/app/shared/layout/tabs';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { ToggleGroupDisabledPreview } from './toggle-group--disabled.preview';
import { ToggleGroupSpacingForm } from './toggle-group--form.preview';
import { ToggleGroupLargePreview } from './toggle-group--large.preview';
import { ToggleGroupOutlinePreview } from './toggle-group--outline.preview';
import { ToggleGroupSinglePreview } from './toggle-group--single.preview';
import { ToggleGroupSmallPreview } from './toggle-group--small.preview';
import { ToggleGroupSpacingPreview } from './toggle-group--spacing.preview';
import { ToggleGroupPreview, defaultImports, defaultSkeleton } from './toggle-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle Group', api: 'toggle-group' },
	meta: metaWith(
		'spartan/ui - Toggle Group',
		'A group of two-state buttons that can be used to select one or more options.',
	),
	title: 'spartan/ui - Toggle Group',
};

@Component({
	selector: 'spartan-toggle-group-page',
	imports: [
		Code,
		CodePreview,
		MainSection,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		Tabs,
		TabsCli,
		ToggleGroupPreview,
		ToggleGroupOutlinePreview,
		ToggleGroupSmallPreview,
		ToggleGroupLargePreview,
		ToggleGroupDisabledPreview,
		ToggleGroupSinglePreview,
		ToggleGroupSpacingPreview,
		ToggleGroupSpacingForm,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle Group" lead="A group of toggle buttons." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				nxCode="npx nx g @spartan-ng/cli:ui toggle-group"
				ngCode="ng g @spartan-ng/cli:ui toggle-group"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__outline" spartanH4>Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode()" />
			</spartan-tabs>

			<h3 id="examples__single" spartanH4>Single</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-single />
				</div>
				<spartan-code secondTab [code]="_singleCode()" />
			</spartan-tabs>

			<h3 id="examples__small" spartanH4>Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-small />
				</div>
				<spartan-code secondTab [code]="_smallCode()" />
			</spartan-tabs>

			<h3 id="examples__large" spartanH4>Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-large />
				</div>
				<spartan-code secondTab [code]="_largeCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__spacing" spartanH4>Spacing</h3>

			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">spacing="2"</code>
				to add spacing between toggle group items.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-spacing />
				</div>
				<spartan-code secondTab [code]="_spacingCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tooltip" label="Tooltip" />
				<spartan-page-bottom-nav-link direction="previous" href="toggle" label="Toggle" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ToggleGroupPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('toggle-group');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _outlineCode = computed(() => this._snippets()['outline']);
	protected readonly _smallCode = computed(() => this._snippets()['small']);
	protected readonly _singleCode = computed(() => this._snippets()['single']);
	protected readonly _largeCode = computed(() => this._snippets()['large']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _spacingCode = computed(() => this._snippets()['spacing']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
}
