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
import { TextareaButtonPreview } from './textarea--button.preview';
import { TextareaDisabledPreview } from './textarea--disabled.preview';
import { TextareaField } from './textarea--field.preview';
import { TextareaFormPreview } from './textarea--form.preview';
import { TextareaInvalid } from './textarea--invalid.preview';
import { TextareaRtl } from './textarea--rtl.preview';
import { TextareaPreview, defaultImports, defaultSkeleton } from './textarea.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Textarea', api: 'textarea' },
	meta: metaWith('spartan/ui - Textarea', 'Displays a form textarea or a component that looks like a textarea.'),
	title: 'spartan/ui - Textarea',
};
@Component({
	selector: 'spartan-textarea',
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
		TextareaPreview,
		TextareaField,
		TextareaDisabledPreview,
		TextareaInvalid,
		TextareaButtonPreview,
		TextareaFormPreview,
		TextareaRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Textarea"
				lead="Displays a form textarea or a component that looks like a textarea."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="textarea" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="field" spartanH4>Field</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlm-field</code>
				,
				<code class="${hlmCode}">hlmFieldLabel</code>
				, and
				<code class="${hlmCode}">hlm-field-description</code>
				to create a textarea with a label and description.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-field />
				</div>
				<spartan-code secondTab [code]="_fieldCode()" />
			</spartan-tabs>

			<h3 id="disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="invalid" spartanH4>Invalid</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-invalid />
				</div>
				<spartan-code secondTab [code]="_invalidCode()" />
			</spartan-tabs>

			<h3 id="button" spartanH4>Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-button />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>

			<h3 id="form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-textarea-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="toggle" label="Toggle" />
				<spartan-page-bottom-nav-link direction="previous" href="tabs" label="Tabs" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TextAreaPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('textarea');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _fieldCode = computed(() => this._snippets()['field']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _invalidCode = computed(() => this._snippets()['invalid']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
