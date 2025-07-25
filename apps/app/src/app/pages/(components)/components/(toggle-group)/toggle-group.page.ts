import { RouteMeta } from '@analogjs/router';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { Tabs } from '@spartan-ng/app/app/shared/layout/tabs';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { ToggleGroupDisabledPreview } from './toggle-group--disabled.preview';
import { ToggleGroupLargePreview } from './toggle-group--large.preview';
import { ToggleGroupOutlinePreview } from './toggle-group--outline.preview';
import { ToggleGroupSmallPreview } from './toggle-group--small.preview';

import { Component, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { ToggleGroupPreview, defaultImports, defaultSkeleton } from './toggle-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle Group' },
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
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle Group" lead="A group of toggle buttons." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui toggle-group"
				ngCode="ng g @spartan-ng/cli:ui toggle-group"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode" />
			</spartan-tabs>

			<h3 id="examples__small" class="${hlmH4} mb-2 mt-6">Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-small />
				</div>
				<spartan-code secondTab [code]="_smallCode" />
			</spartan-tabs>

			<h3 id="examples__large" class="${hlmH4} mb-2 mt-6">Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-large />
				</div>
				<spartan-code secondTab [code]="_largeCode" />
			</spartan-tabs>

			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tooltip" label="Tooltip" />
				<spartan-page-bottom-nav-link direction="previous" href="toggle" label="Toggle" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ToggleGroupPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('toggle-group')();
	protected readonly _defaultCode = this._snippets['default'];
	protected readonly _outlineCode = this._snippets['outline'];
	protected readonly _smallCode = this._snippets['small'];
	protected readonly _largeCode = this._snippets['large'];
	protected readonly _disabledCode = this._snippets['disabled'];
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
}
