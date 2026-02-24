import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode, hlmUl } from '@spartan-ng/helm/typography';
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
import { NativeSelectDisabledExample } from './native-select--disabled.example';
import { NativeSelectFormExample } from './native-select--form.example';
import { NativeSelectGroupsExample } from './native-select--groups.example';
import { NativeSelectInvalidExample } from './native-select--invalid.example';
import { NativeSelectPreview, defaultImports, defaultSkeleton } from './native-select.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Native Select', api: 'native-select' },
	meta: metaWith(
		'spartan/ui - Native Select',
		'A styled native HTML select element with consistent design system integration.',
	),
	title: 'spartan/ui - Native Select',
};

@Component({
	selector: 'spartan-native-select',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		TabsCli,
		NativeSelectPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		NativeSelectGroupsExample,
		NativeSelectDisabledExample,
		NativeSelectFormExample,
		NativeSelectInvalidExample,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Native Select"
				lead="A styled native HTML select element with consistent design system integration."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-native-select-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui native-select"
				ngCode="ng g @spartan-ng/cli:ui native-select"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__groups" spartanH4>Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-native-select-groups-example />
				</div>
				<spartan-code secondTab [code]="_groupsCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-native-select-disabled-example />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__invalid" spartanH4>Invalid</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-native-select-invalid-example />
				</div>
				<spartan-code secondTab [code]="_invalidCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-native-select-form-example />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="native-select-vs-select">Native Select vs Select</spartan-section-sub-heading>

			<ul class="${hlmUl}">
				<li>
					Use
					<code class="${hlmCode}">NativeSelect</code>
					for native browser behavior, better performance, or mobile-optimized dropdowns.
				</li>
				<li>
					Use
					<code class="${hlmCode}">Select</code>
					for custom styling, animations, or complex interactions.
				</li>
			</ul>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="navigation-menu" label="Navigation Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="menubar" label="Menubar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class NativeSelectPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('native-select');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _groupsCode = computed(() => this._snippets()['groups']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _invalidCode = computed(() => this._snippets()['invalid']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
