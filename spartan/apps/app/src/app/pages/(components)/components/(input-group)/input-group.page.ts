import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';

import { InputGroupButtonGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--button-group.preview';
import { InputGroupCustomInputPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--custom-input.preview';
import { InputGroupDropdownPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--dropdown.preview';
import { InputGroupLabelPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--label.preview';
import { InputGroupSpinnerPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--spinner.preview';
import { InputGroupTextareaPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--textarea.preview';
import { InputGroupTooltipPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--tooltip.preview';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmCode, HlmP } from '@spartan-ng/helm/typography';
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
import { InputGroupFormPreview } from './input-group--form.preview';
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
		InputGroupFormPreview,
		HlmCode,
		HlmP,
		InputGroupSpinnerPreview,
		SectionSubSubHeading,
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
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__icon" spartanH4>Icons</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-icon-preview />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>
			<h3 id="examples__text" spartanH4>Text</h3>
			<p hlmP>Display additional text information alongside inputs.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-text-preview />
				</div>
				<spartan-code secondTab [code]="_textCode()" />
			</spartan-tabs>
			<h3 id="examples_button" spartanH4>Buttons</h3>
			<p hlmP>Add buttons to perform actions within the input group.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-button-preview />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>

			<h3 id="examples_tooltip" spartanH4>Tooltip</h3>
			<p hlmP>Add tooltips to provide additional context or help.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-tooltip-preview />
				</div>
				<spartan-code secondTab [code]="_tooltipCode()" />
			</spartan-tabs>

			<h3 id="examples_textarea" spartanH4>Textarea</h3>
			<p hlmP>
				Input groups also work with textarea components. Use
				<span hlmCode>block-start</span>
				or
				<span hlmCode>block-end</span>
				for alignment.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-textarea-preview />
				</div>
				<spartan-code secondTab [code]="_textareaCode()" />
			</spartan-tabs>

			<h3 id="examples_spinner" spartanH4>Spinner</h3>
			<p hlmP>Show loading indicators while processing input.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-spinner-preview />
				</div>
				<spartan-code secondTab [code]="_spinnerCode()" />
			</spartan-tabs>

			<h3 id="examples_label" spartanH4>Label</h3>
			<p hlmP>Add labels within input groups to improve accessibility.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-label-preview />
				</div>
				<spartan-code secondTab [code]="_labelCode()" />
			</spartan-tabs>

			<h3 id="examples_dropdown" spartanH4>Dropdown</h3>

			<p hlmP>Pair input groups with dropdown menus for complex interactions.</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="_dropdownCode()" />
			</spartan-tabs>

			<h3 id="examples_button-group" spartanH4>Button Group</h3>
			<p hlmP>Wrap input groups with button groups to create prefixes and suffixes.</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-button-group-preview />
				</div>
				<spartan-code secondTab [code]="_buttonGroupCode()" />
			</spartan-tabs>

			<h3 id="examples_custom-input" spartanH4>Custom Input</h3>

			<p hlmP>
				Add the
				<span hlmCode>data-slot="input-group-control"</span>
				attribute to your custom input for automatic behavior and focus state handling.
			</p>

			<p hlmP>
				No style is applied to the custom input. Apply your own styles using the
				<span hlmCode>class</span>
				prop.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-custom-input-preview />
				</div>
				<spartan-code secondTab [code]="_customInputCode()" />
			</spartan-tabs>

			<h3 id="examples_form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-group-form-preview />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

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
	protected readonly _textCode = computed(() => this._snippets()['text']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _tooltipCode = computed(() => this._snippets()['tooltip']);
	protected readonly _textareaCode = computed(() => this._snippets()['textarea']);
	protected readonly _spinnerCode = computed(() => this._snippets()['spinner']);
	protected readonly _labelCode = computed(() => this._snippets()['label']);
	protected readonly _dropdownCode = computed(() => this._snippets()['dropdown']);
	protected readonly _buttonGroupCode = computed(() => this._snippets()['buttonGroup']);
	protected readonly _customInputCode = computed(() => this._snippets()['customInput']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
