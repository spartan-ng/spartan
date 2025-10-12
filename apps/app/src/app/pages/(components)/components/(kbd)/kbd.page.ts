import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { KbdButtonPreview } from '@spartan-ng/app/app/pages/(components)/components/(kbd)/kbd--button.preview';
import { KbdGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(kbd)/kbd--group.preview';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmH4, HlmTypographyImports } from '@spartan-ng/helm/typography';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { KbdPreview, defaultImports, defaultSkeleton } from './kbd.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'kbd', api: 'kbd' },
	meta: metaWith('spartan/ui - kbd', 'Used to display textual user input from keyboard.'),
	title: 'spartan/ui - kbd',
};

@Component({
	selector: 'spartan-kbd',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		KbdPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		KbdGroupPreview,
		HlmH4,
		HlmTypographyImports,
		KbdButtonPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Kbd" lead="Used to display textual user input from keyboard." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-kbd-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui kbd" ngCode="ng g @spartan-ng/cli:ui kbd" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples_group" hlmH4 class="mt-6 mb-2">Group</h3>

			<p hlmP>
				Use the
				<span hlmCode>HlmKbdGroup</span>
				component to group keyboard keys together.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code" class="mt-6">
				<div spartanCodePreview firstTab>
					<spartan-kbd-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples_button" hlmH4 class="mt-6 mb-2">Button</h3>

			<p hlmP>
				Use the
				<span hlmCode>HlmKbd</span>
				component inside a
				<span hlmCode>HlmBtn</span>
				to display a keyboard key inside a button.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code" class="mt-6">
				<div spartanCodePreview firstTab>
					<spartan-kbd-button-preview />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="label" label="Label" />
				<spartan-page-bottom-nav-link direction="previous" href="input-otp" label="Input OTP" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class KbdPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('kbd');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
