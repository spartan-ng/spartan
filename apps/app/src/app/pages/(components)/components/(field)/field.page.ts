import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
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
import { FieldCheckboxPreview } from './field--checkbox.preview';
import { FieldChoiceCardPreview } from './field--choice-card.preview';
import { FieldGroupPreview } from './field--group.preview';
import { FieldInputPreview } from './field--input.preview';
import { FieldRadioPreview } from './field--radio.preview';
import { FieldResponsiveLayoutPreview } from './field--responsive-layout.preview';
import { FieldSelectPreview } from './field--select.preview';
import { FieldSetPreview } from './field--set.preview';
import { FieldSliderPreview } from './field--slider.preview';
import { FieldSwitchPreview } from './field--switch.preview';
import { FieldTextareaPreview } from './field--textarea.preview';
import { anatomyCode, defaultImports, defaultSkeleton, FieldPreview } from './field.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Field', api: 'field' },
	meta: metaWith(
		'spartan/ui - Field',
		'Combine labels, controls, and help text to compose accessible form fields and grouped inputs.',
	),
	title: 'spartan/ui - Field',
};
@Component({
	selector: 'spartan-field',
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
		FieldPreview,
		FieldInputPreview,
		FieldTextareaPreview,
		FieldSelectPreview,
		FieldSliderPreview,
		FieldSetPreview,
		FieldCheckboxPreview,
		FieldRadioPreview,
		FieldSwitchPreview,
		FieldChoiceCardPreview,
		FieldGroupPreview,
		FieldResponsiveLayoutPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Field"
				lead="Combine labels, controls, and help text to compose accessible form fields and grouped inputs."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui field"
				ngCode="ng g @spartan-ng/cli:ui field"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="anatomy">Anatomy</spartan-section-sub-heading>
			<p class="${hlmP} mb-2">
				The
				<code class="${hlmCode}">Field</code>
				family is designed for composing accessible forms. A typical field is structured as follows:
			</p>
			<div class="py-4">
				<spartan-code [code]="_anatomyCode" />
			</div>
			<ul class="my-6 ml-6 list-disc">
				<li class="mt-2">
					<code class="${hlmCode} mr-0.5">HlmField</code>
					is the core wrapper for a single field.
				</li>
				<li class="mt-2">
					<code class="${hlmCode} mr-0.5">HlmFieldContent</code>
					is a flex column that groups label and description. Not required if you have no description.
				</li>
				<li class="mt-2">
					Wrap related fields with
					<code class="${hlmCode} mr-0.5">HlmFieldGroup</code>
					, and use
					<code class="${hlmCode} mr-0.5">HlmFieldSet</code>
					with
					<code class="${hlmCode} mr-0.5">HlmFieldLegend</code>
					for semantic grouping.
				</li>
			</ul>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__orientation" class="${hlmH4} mt-6">Input</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-input-preview />
				</div>
				<spartan-code secondTab [code]="_inputCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Textarea</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-textarea-preview />
				</div>
				<spartan-code secondTab [code]="_textareaCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Select</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-select-preview />
				</div>
				<spartan-code secondTab [code]="_selectCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Slider</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-slider-preview />
				</div>
				<spartan-code secondTab [code]="_sliderCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Fieldset</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-set-preview />
				</div>
				<spartan-code secondTab [code]="_fieldsetCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Checkbox</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-checkbox-preview />
				</div>
				<spartan-code secondTab [code]="_checkboxCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Radio</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-radio-preview />
				</div>
				<spartan-code secondTab [code]="_radioCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Switch</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-switch-preview />
				</div>
				<spartan-code secondTab [code]="_switchCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Choice Card</h3>
			<p class="${hlmP} mb-2">
				Wrap
				<code class="${hlmCode} mr-0.5">HlmField</code>
				directives inside
				<code class="${hlmCode} mr-0.5">HlmFieldLabel</code>
				to create selectable field groups. This works with
				<code class="${hlmCode} mr-0.5">RadioItem</code>
				,
				<code class="${hlmCode} mr-0.5">Checkbox</code>
				and
				<code class="${hlmCode} mr-0.5">Switch</code>
				components.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-choice-card-preview />
				</div>
				<spartan-code secondTab [code]="_choiceCardCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Field Group</h3>
			<p class="${hlmP} mb-2">
				Stack
				<code class="${hlmCode} mr-0.5">HlmField</code>
				directives with
				<code class="${hlmCode} mr-0.5">HlmFieldGroup</code>
				. Add
				<code class="${hlmCode} mr-0.5">HlmFieldSeparator</code>
				to divide them.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__orientation" class="${hlmH4} mt-6">Resposive Layout</h3>
			<ul class="my-6 ml-6 list-disc">
				<li class="mt-2">
					<strong class="font-medium">Vertical fields:</strong>
					Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.
				</li>
				<li class="mt-2">
					<strong class="font-medium">Horizontal fields:</strong>
					Set
					<code class="${hlmCode} mr-0.5">orientation="horizontal"</code>
					on
					<code class="${hlmCode} mr-0.5">HlmField</code>
					to align the label and control side-by-side. Pair with
					<code class="${hlmCode} mr-0.5">HlmFieldContent</code>
					to keep descriptions aligned.
				</li>
				<li class="mt-2">
					<strong class="font-medium">Responsive fields:</strong>
					Set
					<code class="${hlmCode} mr-0.5">orientation="responsive"</code>
					for automatic column layouts inside container-aware parents. Apply
					<code class="${hlmCode} mr-0.5">&#64;container/field-group</code>
					classes on
					<code class="${hlmCode} mr-0.5">HlmFieldGroup</code>
					to switch orientations at specific breakpoints.
				</li>
			</ul>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-field-responsive-layout-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="hover-card" label="Hover Card" />
				<spartan-page-bottom-nav-link direction="previous" href="empty" label="Empty" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class FieldPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('field');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _inputCode = computed(() => this._snippets()['input']);
	protected readonly _textareaCode = computed(() => this._snippets()['textarea']);
	protected readonly _selectCode = computed(() => this._snippets()['select']);
	protected readonly _sliderCode = computed(() => this._snippets()['slider']);
	protected readonly _fieldsetCode = computed(() => this._snippets()['fieldset']);
	protected readonly _checkboxCode = computed(() => this._snippets()['checkbox']);
	protected readonly _radioCode = computed(() => this._snippets()['radio']);
	protected readonly _switchCode = computed(() => this._snippets()['switch']);
	protected readonly _choiceCardCode = computed(() => this._snippets()['choiceCard']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);

	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _anatomyCode = anatomyCode;
}
