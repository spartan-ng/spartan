import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';

import { InputGroupButtonGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--button-group.preview';
import { InputGroupCustomInputPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--custom-input.preview';
import { InputGroupDropdownPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--dropdown.preview';
import { InputGroupLabelPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--label.preview';
import { InputGroupTextareaPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--textarea.preview';
import { InputGroupTooltipPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--tooltip.preview';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmH4 } from '@spartan-ng/helm/typography';
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
import { InputGroupButtonPreview } from './input-group--button.preview';
import { InputGroupIconPreview } from './input-group--icon.preview';
import { InputGroupTextPreview } from './input-group--text.preview';
import { defaultImports, defaultSkeleton, InputGroupPreview } from './input-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'input-group', api: 'input-group' },
	meta: metaWith(
		'spartan/ui - input-group',
		'A flexible input group that combines inputs with addons, prefixes, and suffixes to improve usability.',
	),
	title: 'spartan/ui - input-group',
};

@Component({
	selector: 'spartan-input-group',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		InputGroupPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		HlmH4,
		InputGroupIconPreview,
		InputGroupButtonPreview,
		InputGroupIconPreview,
		InputGroupIconPreview,
		InputGroupIconPreview,
		InputGroupTextPreview,
		InputGroupTextPreview,
		InputGroupTextPreview,
		InputGroupTooltipPreview,
		InputGroupTextareaPreview,
		InputGroupLabelPreview,
		InputGroupDropdownPreview,
		InputGroupButtonGroupPreview,
		InputGroupCustomInputPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Input Group"
				lead="A flexible input group that combines inputs with addons, prefixes, and suffixes to improve usability."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui input-group"
				ngCode="ng g @spartan-ng/cli:ui input-group"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__icon" hlmH4 class="mb-2 mt-6">Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-icon-preview />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>
			<h3 id="examples__text" hlmH4 class="mb-2 mt-6">Text</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-text-preview />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>
			<h3 id="examples_button" hlmH4 class="mb-2 mt-6">Buttons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-button-preview />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>

			<h3 id="examples_tooltip" hlmH4 class="mb-2 mt-6">Tooltip</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-tooltip-preview />
				</div>
				<spartan-code secondTab [code]="_tooltipCode()" />
			</spartan-tabs>

			<h3 id="examples_textarea" hlmH4 class="mb-2 mt-6">Textarea</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-textarea-preview />
				</div>
				<spartan-code secondTab [code]="_textareaCode()" />
			</spartan-tabs>

			<!--	todo add spinner when spinner is available		-->

			<h3 id="examples_label" hlmH4 class="mb-2 mt-6">Label</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-label-preview />
				</div>
				<spartan-code secondTab [code]="_labelCode()" />
			</spartan-tabs>

			<h3 id="examples_dropdown" hlmH4 class="mb-2 mt-6">Dropdown</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="_dropdownCode()" />
			</spartan-tabs>

			<h3 id="examples_button-group" hlmH4 class="mb-2 mt-6">Button Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-button-group-preview />
				</div>
				<spartan-code secondTab [code]="_buttonGroupCode()" />
			</spartan-tabs>

			<h3 id="examples_custom-input" hlmH4 class="mb-2 mt-6">Custom Input</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-custom-input-preview />
				</div>
				<spartan-code secondTab [code]="_customInputCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link label="Input OTP" href="input-otp" />
				<spartan-page-bottom-nav-link direction="previous" label="Input" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputGroupPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('input-group');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _iconCode = computed(() => this._snippets()['icon']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _tooltipCode = computed(() => this._snippets()['tooltip']);
	protected readonly _textareaCode = computed(() => this._snippets()['textarea']);
	protected readonly _labelCode = computed(() => this._snippets()['label']);
	protected readonly _dropdownCode = computed(() => this._snippets()['dropdown']);
	protected readonly _buttonGroupCode = computed(() => this._snippets()['buttonGroup']);
	protected readonly _customInputCode = computed(() => this._snippets()['customInput']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
