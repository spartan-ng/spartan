import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { InputBadge } from './input--badge.preview';
import { InputBasic } from './input--basic.preview';
import { InputButtonGroup } from './input--button-group.preview';
import { InputDisabledPreview } from './input--disabled.preview';
import { InputFieldGroup } from './input--field-group.preview';
import { InputField } from './input--field.preview';
import { InputFilePreview } from './input--file.preview';
import { InputFormPreview } from './input--form.preview';
import { InputGrid } from './input--grid.preview';
import { InputInline } from './input--inline.preview';
import { InputInputGroup } from './input--input-group.preview';
import { InputInvalid } from './input--invalid.preview';
import { InputRequired } from './input--required.preview';
import { InputRtl } from './input--rtl.preview';
import { defaultImports, defaultSkeleton, InputPreview } from './input.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Input', api: 'input' },
	meta: metaWith(
		'spartan/ui - Input',
		'Gives an input field or a component a distinct look that indicates its input capabilities.',
	),
	title: 'spartan/ui - Input',
};
@Component({
	selector: 'spartan-input',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		InputPreview,
		InputBasic,
		InputField,
		InputFieldGroup,
		InputDisabledPreview,
		InputInvalid,
		InputFilePreview,
		InputInline,
		InputGrid,
		InputRequired,
		InputBadge,
		InputInputGroup,
		InputButtonGroup,
		InputFormPreview,
		InputRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Input"
				lead="Gives an input field or a component a distinct look that indicates its input capabilities"
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="input" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-basic />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="field" spartanH4>Field</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlm-field</code>
				,
				<code class="${hlmCode}">hlmFieldLabel</code>
				, and
				<code class="${hlmCode}">hlm-field-description</code>
				to create an input with a label and description.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-field />
				</div>
				<spartan-code secondTab [code]="_fieldCode()" />
			</spartan-tabs>

			<h3 id="field-group" spartanH4>Field Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-field-group />
				</div>
				<spartan-code secondTab [code]="_fieldGroupCode()" />
			</spartan-tabs>

			<h3 id="disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="invalid" spartanH4>Invalid</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-invalid />
				</div>
				<spartan-code secondTab [code]="_invalidCode()" />
			</spartan-tabs>

			<h3 id="file" spartanH4>File</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-file />
				</div>
				<spartan-code secondTab [code]="_fileCode()" />
			</spartan-tabs>

			<h3 id="inline" spartanH4>Inline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-inline />
				</div>
				<spartan-code secondTab [code]="_inlineCode()" />
			</spartan-tabs>

			<h3 id="grid" spartanH4>Grid</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-grid />
				</div>
				<spartan-code secondTab [code]="_gridCode()" />
			</spartan-tabs>

			<h3 id="required" spartanH4>Required</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-required />
				</div>
				<spartan-code secondTab [code]="_requiredCode()" />
			</spartan-tabs>

			<h3 id="badge" spartanH4>Badge</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-badge />
				</div>
				<spartan-code secondTab [code]="_badgeCode()" />
			</spartan-tabs>

			<h3 id="input-group" spartanH4>Input Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-input-group />
				</div>
				<spartan-code secondTab [code]="_inputGroupCode()" />
			</spartan-tabs>

			<h3 id="button-group" spartanH4>Button Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-button-group />
				</div>
				<spartan-code secondTab [code]="_buttonGroupCode()" />
			</spartan-tabs>

			<h3 id="form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-input-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="item" label="Item" />
				<spartan-page-bottom-nav-link direction="previous" href="input-otp" label="Input OTP" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('input');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _fieldCode = computed(() => this._snippets()['field']);
	protected readonly _fieldGroupCode = computed(() => this._snippets()['fieldGroup']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _invalidCode = computed(() => this._snippets()['invalid']);
	protected readonly _fileCode = computed(() => this._snippets()['file']);
	protected readonly _inlineCode = computed(() => this._snippets()['inline']);
	protected readonly _gridCode = computed(() => this._snippets()['grid']);
	protected readonly _requiredCode = computed(() => this._snippets()['required']);
	protected readonly _badgeCode = computed(() => this._snippets()['badge']);
	protected readonly _inputGroupCode = computed(() => this._snippets()['inputGroup']);
	protected readonly _buttonGroupCode = computed(() => this._snippets()['buttonGroup']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
