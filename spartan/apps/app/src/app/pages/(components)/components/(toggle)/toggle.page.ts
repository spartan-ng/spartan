import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ToggleDisabledPreview } from './toggle--disabled.preview';
import { ToggleLargePreview } from './toggle--large.preview';
import { ToggleOutlinePreview } from './toggle--outline.preview';
import { ToggleSmallPreview } from './toggle--small.preview';
import { ToggleWithTextPreview } from './toggle--with-text.preview';
import { TogglePreview, defaultImports, defaultSkeleton } from './toggle.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle', api: 'toggle' },
	meta: metaWith('spartan/ui - Toggle', 'A two-state button that can be either on or off.'),
	title: 'spartan/ui - Toggle',
};
@Component({
	selector: 'spartan-input',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		TogglePreview,
		ToggleDisabledPreview,
		ToggleLargePreview,
		ToggleOutlinePreview,
		ToggleSmallPreview,
		ToggleWithTextPreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle" lead="A two-state button that can be either on or off." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui toggle" ngCode="ng g @spartan-ng/cli:ui toggle" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__outline" spartanH4>Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode()" />
			</spartan-tabs>
			<h3 id="examples__with_text" spartanH4>With Text</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-with-text />
				</div>
				<spartan-code secondTab [code]="_withTextCode()" />
			</spartan-tabs>
			<h3 id="examples__small" spartanH4>Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-small />
				</div>
				<spartan-code secondTab [code]="_smallCode()" />
			</spartan-tabs>
			<h3 id="examples__large" spartanH4>Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-large />
				</div>
				<spartan-code secondTab [code]="_largeCode()" />
			</spartan-tabs>
			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="toggle-group" label="Toggle Group" />
				<spartan-page-bottom-nav-link direction="previous" href="textarea" label="Textarea" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TogglePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('toggle');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _largeCode = computed(() => this._snippets()['large']);
	protected readonly _outlineCode = computed(() => this._snippets()['outline']);
	protected readonly _smallCode = computed(() => this._snippets()['small']);
	protected readonly _withTextCode = computed(() => this._snippets()['withText']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
